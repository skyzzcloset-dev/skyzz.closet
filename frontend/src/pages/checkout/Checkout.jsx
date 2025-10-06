import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
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
  const [orders, setOrders] = useState([]);

  // Fetch products in cart
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

  // Load Razorpay script
  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // Display Razorpay checkout
  const displayRazorpay = async (razorpayOrderId, amount) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) return alert("Razorpay SDK failed to load!");

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: "INR",
      order_id: razorpayOrderId,
      handler: async function (response) {
        try {
          // Verify payment on backend
          const {data} = await axios.post(
            "http://localhost:3004/api/payment/verify",
            {
              razorpayOrderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // send user token
              },
            }
          );
          alert("Payment Successful!");
          console.log(data.payment);
        } catch (err) {
          console.error("Payment verification failed:", err);
          alert("Payment verification failed!");
        }
      },
      prefill: {
        email: orders[0]?.email || "",
        contact: orders[0]?.phone || "",
      },
      theme: {color: "#3399cc"},
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const onSubmit = async (data) => {
    try {
      // Build shippingAddress payload
      const shippingAddress = {
        street: data.address,
        apartment: data.apartment,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: "India",
        phone: data.phone,
      };

      const items = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: {amount: item.price, currency: "INR"},
      }));

      const payload = {
        items,
        shippingAddress,
        totalAmount: {price: subtotal, currency: "INR"},
      };

      // Dispatch order creation
      const response = await dispatch(createOrder(payload)).unwrap();
      const orderId = response.order._id;
      console.log("Order ID:", orderId);

      // Get JWT token from localStorage or wherever you store it
      const token = localStorage.getItem("token");

      // Call payment API
      const {data: paymentData} = await axios.post(
        `http://localhost:3004/api/payment/create/${orderId}`,
        {}, // body can be empty
        {
          headers: {Authorization: `Bearer ${token}`},
          withCredentials: true, // if using cookies
        }
      );

      // Open Razorpay checkout
      await displayRazorpay(paymentData.payment.razorpayOrderId, subtotal);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong while placing the order.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start px-4 py-8">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6">
        {/* Form */}
        <div className="w-full lg:w-3/5 px-6 py-8 bg-white shadow-sm rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-xl font-semibold mb-6">Contact</h2>
            <input
              type="email"
              placeholder="Email"
              {...register("email", {required: "Email is required"})}
              className="w-full border p-3 mb-2 rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-2">
                {errors.email.message}
              </p>
            )}

            <h2 className="text-xl font-semibold mb-6">Delivery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="First name"
                {...register("firstName", {required: "First name required"})}
                className="border p-3 rounded"
              />
              <input
                type="text"
                placeholder="Last name"
                {...register("lastName", {required: "Last name required"})}
                className="border p-3 rounded"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-500 text-sm mb-2">
                {errors.firstName.message}
              </p>
            )}
            {errors.lastName && (
              <p className="text-red-500 text-sm mb-2">
                {errors.lastName.message}
              </p>
            )}

            <input
              type="text"
              placeholder="Address"
              {...register("address", {required: "Address is required"})}
              className="w-full border p-3 mb-3 rounded"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mb-2">
                {errors.address.message}
              </p>
            )}

            <input
              type="text"
              placeholder="Apartment, suite, etc. (optional)"
              {...register("apartment")}
              className="w-full border p-3 mb-3 rounded"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <input
                type="text"
                placeholder="City"
                {...register("city", {required: "City is required"})}
                className="border p-3 rounded"
              />
              <select
                {...register("state", {required: "State is required"})}
                className="border p-3 rounded"
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
                className="border p-3 rounded"
              />
            </div>
            {(errors.city || errors.state || errors.zip) && (
              <p className="text-red-500 text-sm mb-2">
                {errors.city?.message ||
                  errors.state?.message ||
                  errors.zip?.message}
              </p>
            )}

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
              className="w-full border p-3 mb-3 rounded"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mb-2">
                {errors.phone.message}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
            >
              Continue to Payment
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-2/5 px-10 py-8 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          {orders.length ? (
            <div className="space-y-4">
              {orders.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center pb-2"
                >
                  <div className="flex gap-3 items-center">
                    <img
                      src={item.images?.[0]?.url || "https://placehold.co/60"}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} | Size: {item.sizes}
                      </p>
                    </div>
                  </div>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{subtotal}</span>
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
