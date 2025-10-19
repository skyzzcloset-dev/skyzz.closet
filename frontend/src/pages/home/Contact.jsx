import React from "react";

const Contact = () => {
  return (
    <div className="h-150 flex items-center justify-center  px-4">
      <div className=" rounded-2xl shadow-md p-10 border border-gray-300 hover:shadow-lg transition">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <p className="text-gray-700 mb-4">
          We'd love to hear from you! Reach out to us via:
        </p>
        <div className="space-y-3">
          <p className="text-gray-800">
            <span className="font-semibold">Email:</span> skyzzcloset@gmail.com
          </p>
          <p className="text-gray-800">
            <span className="font-semibold">Instagram:</span>{" "}
            <a
              href="https://www.instagram.com/skyzz.closet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              @skyzz.closet
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
