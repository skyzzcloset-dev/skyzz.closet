import React from "react";

const HeroSection = () => {
  return (
    <div className="relative w-full h-[600px] lg:h-[740px]">
      {/* Hero Image with srcSet */}
      <img
        src="/Hero4_962.jpg" // default fallback
        srcSet="
          /Hero4_657.jpg 657w,
          /Hero4_962.jpg 962w,
          /Hero4_1117.jpg 1117w,
          /Hero4_1267.jpg 1267w,
          /Hero4_1400.jpg 1400w
        "
        sizes="(max-width: 640px) 100vw, 
               (max-width: 1024px) 100vw, 
               1400px"
        alt="Hero Image"
        fetchPriority="high"
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
