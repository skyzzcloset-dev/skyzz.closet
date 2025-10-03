import React from "react";
import {useForm} from "react-hook-form";

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

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start px-4 py-8">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6">
        {/* Left Section - Form */}
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
            <div className="flex items-center gap-2 mb-6">
              <input type="checkbox" {...register("newsletter")} />
              <label>Email me with news and offers</label>
            </div>

            <h2 className="text-xl font-semibold mb-6">Delivery</h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
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

            <div className="grid grid-cols-3 gap-3 mb-3">
              <input
                type="text"
                placeholder="City"
                {...register("city", {required: "City is required"})}
                className="border p-3 rounded"
              />

              {/* State Dropdown */}
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
                placeholder="PIN code"
                {...register("pin", {required: "PIN is required"})}
                className="border p-3 rounded"
              />
            </div>
            {(errors.city || errors.state || errors.pin) && (
              <p className="text-red-500 text-sm mb-2">
                {errors.city?.message ||
                  errors.state?.message ||
                  errors.pin?.message}
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

            <div className="flex items-center gap-2 mb-6">
              <input type="checkbox" {...register("saveInfo")} />
              <label>Save this information for next time</label>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
            >
              Continue to Payment
            </button>
          </form>
        </div>

        {/* Right Section - Order Summary */}
        <div className="w-full lg:w-2/5 px-6 py-8 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <div className="flex gap-2 items-center">
              <img
                src="https://via.placeholder.com/60"
                alt="product"
                className="w-14 h-14 object-cover rounded"
              />
              <span>Shirt</span>
            </div>
            <span>₹499.00</span>
          </div>

          <input
            type="text"
            placeholder="Discount code"
            className="w-full border p-2 rounded mb-2"
          />
          <button className="w-full bg-gray-200 py-2 rounded mb-4">
            Apply
          </button>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹499.00</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>Enter shipping address</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹499.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
