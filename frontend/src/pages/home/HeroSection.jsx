import React from "react";

const HeroSection = () => {
  return (
    <div className="relative w-full h-[500px] sm:h-[500px] md:h-[600px] lg:h-[740px]">
      {/* Hero Image with srcSet */}
      <img
        src="/heroImage_jhlt5e/heroImage_jhlt5e_c_scale,w_603.webp"
        srcSet="
          /heroImage/heroImage_200.webp 200w,
          /heroImage/heroImage_603.webp 603w,
          /heroImage/heroImage_927.webp 927w,
          /heroImage/heroImage_1056.webp 1056w
        "
        sizes="(max-width: 640px) 100vw, 
               (max-width: 1024px) 100vw, 
               1056px"
        alt="Hero Image"
        fetchPriority="high"
        className="w-full h-full object-cover object-center"
      />

      {/* Fade effect only at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white/80 to-transparent"></div>

      {/* Text content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10">
        <h1 className="text-4xl sm:text-5xl font-bold drop-shadow-lg">
          Welcome to Our Store
        </h1>
        <p className="mt-4 text-md sm:text-lg drop-shadow-md">
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
