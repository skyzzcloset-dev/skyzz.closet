import React from "react";
import {Truck, Clock, Info, Package} from "lucide-react";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 px-6 py-12 md:px-20">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold ">Shipping Policy</h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Transparent, fast, and reliable delivery for every order ✨
        </p>
      </div>

      {/* Shipping Sections */}
      <div className="space-y-10 max-w-3xl mx-auto">
        {/* Standard Shipping */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="text-pink-500 w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-900">
              Standard Shipping
            </h2>
          </div>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              Shipping Time: Orders are shipped within <b>2-3 working day</b>{" "}
              (subject to availability).
            </li>
            <li>
              Delivery Time: Orders are delivered within <b>5-7 working days</b>
              .
            </li>
            <li>
              Shipping Charges: For Delhi <b>₹60</b> , Outside Delhi <b>₹80</b>{" "}
              per order.
            </li>
          </ul>
        </div>

        {/* Express Shipping */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-purple-500 w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-900">
              Express Shipping{" "}
              <span className="text-sm text-gray-500">
                (Contact us on Instagram  {" "}
                <a
                  href="https://www.instagram.com/skyzz.closet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  @skyzz.closet
                </a>
                )
              </span>
            </h2>
          </div>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              Shipping Time: Orders are shipped within <b>1 working day</b>{" "}
              (subject to availability).
            </li>
            <li>
              Delivery Time: Orders are delivered within <b>1–3 working days</b>
              .
            </li>
            <li>
              Shipping Charges: <b>₹250</b> per order.
            </li>
          </ul>
        </div>

        {/* Important Notes */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4">
            <Info className="text-indigo-500 w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-900">
              Important Notes
            </h2>
          </div>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <b>Working Days:</b> Do not include weekends or public holidays.
            </li>
            <li>
              <b>Order Status Updates:</b> You can check it on website 
            </li>
            <li>
              <b>Missing Deliveries:</b> If your parcel shows ‘delivered’ but
              hasn’t arrived, please inform us within <b>24 hours</b>. We cannot
              assist after this period.
            </li>
          </ul>
        </div>

        {/* Thank You Message */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl p-8 shadow-lg text-center">
          <Package className="w-10 h-10 mx-auto mb-3" />
          <p className="text-lg font-medium">
            Thank you so much for your order! 💖
          </p>
          <p className="mt-2 text-sm text-pink-100">
            We’re grateful for your trust and love in our brand. We hope you
            enjoy your order as much as we loved curating it for you. ✨ Looking
            forward to hearing your feedback!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
