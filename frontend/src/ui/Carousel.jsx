import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";


// Hook: slides per view depending on screen size
const useSlidesPerView = () => {
  const [slides, setSlides] = useState(1);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setSlides(3); // large screens
      else if (window.innerWidth >= 768) setSlides(2); // md
      else setSlides(1); // small
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return slides;
};

const Carousel = ({products}) => {
  const slidesPerView = useSlidesPerView();
  const [index, setIndex] = useState(0);

  // Keep index always valid
  useEffect(() => {
    setIndex((i) => Math.min(i, products.length - slidesPerView));
  }, [slidesPerView]);

  const next = () =>
    setIndex((i) => Math.min(i + 1, products.length - slidesPerView));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  return (
    <div className="relative w-full max-w-8xl mx-auto overflow-hidden py-8">
      {/* Carousel */}
      <motion.div
        className="flex"
        animate={{ x: `-${(index * 100) / slidesPerView}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 25 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -50) next();
          if (info.offset.x > 50) prev();
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className={`flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 flex flex-col items-center px-4`}
          >
            <NavLink to={product.link}>
              <img
                src={product.img}
                alt={product.name}
                className="w-full lg:h-85 object-contain rounded-2xl shadow-lg bg-white"
              />
              <h3 className="mt-4 text-xl font-semibold text-center">
                {product.name}
              </h3>
            </NavLink>
          </div>
        ))}
      </motion.div>

      {/* Left Arrow */}
      <button
        onClick={prev}
        disabled={index === 0}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white p-3 border rounded-full shadow hover:scale-110 transition disabled:opacity-30"
      >
        <i className="ri-arrow-left-line text-2xl"></i>
      </button>

      {/* Right Arrow */}
      <button
        onClick={next}
        disabled={index >= products.length - slidesPerView}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white p-3 border rounded-full shadow hover:scale-110 transition disabled:opacity-30"
      >
        <i className="ri-arrow-right-line text-2xl"></i>
      </button>
    </div>
  );
};

export default Carousel;

