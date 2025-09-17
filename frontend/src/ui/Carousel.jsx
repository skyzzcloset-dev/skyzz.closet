import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";

function Carousel({products = [], perView = 3, title = ""}) {
  const NextArrow = ({onClick}) => (
    <button
      onClick={onClick}
      aria-label="Next"
      className="absolute hidden lg:flex items-center justify-center top-1/2 -right-4 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-3 hover:bg-gray-200 transition"
    >
      <FaChevronRight size={20} />
    </button>
  );

  const PrevArrow = ({onClick}) => (
    <button
      onClick={onClick}
      aria-label="Previous"
      className="absolute hidden lg:flex items-center justify-center top-1/2 -left-4 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-3 hover:bg-gray-200 transition"
    >
      <FaChevronLeft size={20} />
    </button>
  );

  const settings = {
    infinite: true,
    slidesToShow: perView,
    swipeToSlide: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {breakpoint: 1280, settings: {slidesToShow: Math.min(perView, 3)}}, // Desktop
      {breakpoint: 1024, settings: {slidesToShow: 2}}, // Tablet
      {breakpoint: 640, settings: {slidesToShow: 1, arrows: false}}, // Mobile
    ],
  };

  return (
    <div className="relative my-2 lg:my-6 px-2">
      <Slider {...settings}>
        {products.map((product, index) => (
          <div key={index} className="px-9">
            <div className="bg-white rounded-xl w-75 lg:w-90  border shadow-md overflow-hidden hover:shadow-lg transition ">
              <div className="h-75 lg:h-60a w-full flex items-center justify-center bg-gray-50">
                <img
                  src={product.img}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="cursor-pointer h-full w-full"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-base md:text-lg font-semibold line-clamp-2">
                  {product.name}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Carousel;
