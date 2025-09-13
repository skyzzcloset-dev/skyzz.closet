import React from "react";

const HeroSection = () => {
  return (
    <div className="relative w-full h-[740px]">
      {/* Hero Image */}
      <img
        src="/Hero4.jpg"
        alt="Hero"
        className="w-full h-full object-cover object-center"
      />

      {/* Fade effect only at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-22 bg-gradient-to-t from-white to-transparent"></div>

      {/* Text content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10">
        <h1 className="text-5xl font-bold drop-shadow-lg">
          Welcome to Our Store
        </h1>
        <p className="mt-4 text-lg drop-shadow-md">
          Discover the latest collections just for you
        </p>
        <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
