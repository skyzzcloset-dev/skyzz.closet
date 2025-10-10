import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {createOrder} from "../../features/orders/orderSlice";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const Checkout = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm();
  const {cartItems} = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // ✅ prevent multiple payment attempts

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const responses = await Promise.all(
          cartItems.map((item) =>
            axios.get(`http://localhost:8000/api/product/get/${item.productId}`)
          )
        );
        const fetchedOrders = responses.map((res, idx) => ({
          ...res.data.product,
          quantity: cartItems[idx].quantity,
          sizes: cartItems[idx].sizes,
        }));
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    if (cartItems.length) fetchOrders();
  }, [cartItems]);

  const subtotal = orders.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal - discount;

  const applyDiscount = () => {
    if (discountCode.trim().toUpperCase() === "SAVE10") {
      const calc = Math.floor(subtotal * 0.1);
      setDiscount(calc);
    } else {
      setDiscount(0);
    }
  };

  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const displayRazorpay = async (razorpayOrderId) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) return alert("Razorpay SDK failed to load!");

    const finalAmount = (subtotal - discount) * 100; // ✅ amount in paise

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: finalAmount,
      currency: "INR",
      order_id: razorpayOrderId,
      handler: async function (response) {
        try {
          const {data} = await axios.post(
            "http://localhost:3004/api/payment/verify",
            {
              razorpayOrderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          alert("Payment Successful!");
          console.log(data.payment);
          navigate("/order-success");
        } catch (err) {
          console.error("Payment verification failed:", err);
          alert("Payment verification failed!");
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        email: orders[0]?.email || "",
        contact: orders[0]?.phone || "",
      },
      theme: {color: "#4F46E5"},
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const onSubmit = async (data) => {
    if (isProcessing) return; // ✅ prevent double submit
    setIsProcessing(true);

    try {
      const shippingAddress = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        street: data.address,
        apartment: data.apartment,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: "India",
      };

      const items = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: {amount: item.price, currency: "INR"},
      }));

      const payload = {
        items,
        shippingAddress,
        totalAmount: {price: total, currency: "INR"},
      };

      const response = await dispatch(createOrder(payload)).unwrap();
      const orderId = response.order._id;
      console.log("Order ID:", orderId);

      const token = localStorage.getItem("token");
      const {data: paymentData} = await axios.post(
        `http://localhost:3004/api/payment/create/${orderId}`,
        {},
        {
          headers: {Authorization: `Bearer ${token}`},
          withCredentials: true,
        }
      );

      await displayRazorpay(paymentData.payment.razorpayOrderId);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong while placing the order.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex justify-center items-start px-4 py-8">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">
        {/* FORM */}
        <div className="w-full lg:w-3/5 bg-white rounded-2xl shadow-md p-6 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Contact
            </h2>
            <input
              type="email"
              placeholder="Email"
              {...register("email", {required: "Email is required"})}
              className="w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">
              Delivery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First name"
                {...register("firstName", {required: "First name required"})}
                className="p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="text"
                placeholder="Last name"
                {...register("lastName", {required: "Last name required"})}
                className="p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <input
              type="text"
              placeholder="Address"
              {...register("address", {required: "Address is required"})}
              className="w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <input
              type="text"
              placeholder="Apartment, suite, etc. (optional)"
              {...register("apartment")}
              className="w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="City"
                {...register("city", {required: "City is required"})}
                className="p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <select
                {...register("state", {required: "State is required"})}
                className="p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Select State</option>
                {indianStates.map((state, idx) => (
                  <option key={idx} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="ZIP code"
                {...register("zip", {required: "ZIP is required"})}
                className="p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <input
              type="text"
              placeholder="Phone"
              {...register("phone", {
                required: "Phone is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Invalid phone number",
                },
              })}
              className="w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3 text-white rounded-lg font-medium text-lg transition ${
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isProcessing ? "Processing..." : "Continue to Payment"}
            </button>
          </form>
        </div>

        {/* ORDER SUMMARY */}
        <div className="w-full lg:w-2/5 bg-white rounded-2xl shadow-md p-6 md:p-8 h-fit">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>
          {orders.length ? (
            <div className="space-y-4">
              {orders.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center pb-3 border-b border-gray-100"
                >
                  <div className="flex gap-3 items-center">
                    <img
                      src={item.images?.[0]?.url || "https://placehold.co/60"}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} | Size: {item.sizes}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-800">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}

              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Discount code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-1 p-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={applyDiscount}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Apply
                </button>
              </div>

              <div className="flex justify-between font-medium mt-4">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold mt-2">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No items in cart.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
