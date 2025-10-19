import React from "react";
import { Ban, Shirt, AlertCircle, Clock } from "lucide-react";

const RefundPolicy = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 px-6 py-12 md:px-20">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">Refund Policy</h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Transparent, fair, and customer-first resolution process ✨
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-10 max-w-3xl mx-auto">
          {/* Final Sale Policy */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <Ban className="text-pink-500 w-6 h-6" />
              <h2 className="text-xl font-semibold text-gray-900">
                Final Sale Policy
              </h2>
            </div>
            <ul className="pl-6 space-y-2 text-gray-700 list-disc">
              <li>All sales are final — we do not offer refunds or cancellations.</li>
            </ul>
          </div>

          {/* Sizing and Product Issues */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <Shirt className="text-purple-500 w-6 h-6" />
              <h2 className="text-xl font-semibold text-gray-900">
                Sizing & Product Issues
              </h2>
            </div>
            <ul className="pl-6 space-y-5 text-gray-700 list-disc">
              <li>
                If you face sizing issues, please reach out to us at{" "}
                <b>skyzzcloset@gmail.com</b> or DM us on Instagram.  
                We’ll help you resell the product or assist with possible alterations.
              </li>
              <li>
                Inspect your order upon arrival. If your item is{" "}
                <b>defective, damaged, or incorrect</b>, contact us immediately
                with photos or videos. We’ll evaluate and arrange pickup or exchange
                where applicable.
              </li>
            </ul>
          </div>

          {/* Response & Notes */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-indigo-500 w-6 h-6" />
              <h2 className="text-xl font-semibold text-gray-900">Response Time & Notes</h2>
            </div>
            <ul className="pl-6 space-y-5 text-gray-700 list-disc">
              <li>All emails and DMs will be addressed within 24 hours.</li>
              <li>
                <b>Note:</b> Our drops include quality samples, wholesale, surplus,
                deadstock, and brand-new pieces.  
                We don’t sell preloved or second-hand items.  
                Minor imperfections may occur, but any noticeable ones will be clearly mentioned.
              </li>
            </ul>
          </div>

          {/* Thank You */}
          <div className="text-center text-gray-600 mt-10">
            <AlertCircle className="mx-auto mb-3 text-pink-400 w-6 h-6" />
            <p>Thank you for understanding and supporting small-batch fashion 🖤</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RefundPolicy;
