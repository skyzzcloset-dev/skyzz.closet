import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const products = [
  { id: 1, name: "Dress", img: "/dress.png", link: "/product/1" },
  { id: 2, name: "Tops", img: "/tops.png", link: "/product/2" },
  { id: 3, name: "Shirts", img: "/shirts.png", link: "/product/3" },
  { id: 4, name: "Jeans", img: "/dress.png", link: "/product/4" },
];

// Hook to detect slides per view
const useSlidesPerView = () => {
  const [slides, setSlides] = useState(1);
  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth >= 1024) setSlides(3);
      else if (window.innerWidth >= 768) setSlides(2);
      else setSlides(1);
    };
    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);
  return slides;
};

const Carousel = () => {
  const slidesPerView = useSlidesPerView();
  const [index, setIndex] = useState(products.length);

  // Make products infinite by duplicating
  const loopedProducts = [...products, ...products, ...products];

  const nextSlide = () => setIndex((prev) => prev + 1);
  const prevSlide = () => setIndex((prev) => prev - 1);

  // Reset position when reaching ends (infinite illusion)
  useEffect(() => {
    if (index >= loopedProducts.length - slidesPerView) {
      setTimeout(() => setIndex(products.length), 300);
    }
    if (index <= 0) {
      setTimeout(() => setIndex(loopedProducts.length - products.length * 2), 300);
    }
  }, [index, slidesPerView]);

  return (
    <div className="relative w-full max-w-8xl mx-auto overflow-hidden">
      <motion.div
        className="flex"
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        animate={{ x: `-${(index * 100) / slidesPerView}%` }}
        transition={{ type: "spring", stiffness: 210, damping: 100 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -50) nextSlide();
          if (info.offset.x > 50) prevSlide();
        }}
      >
        {loopedProducts.map((product, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 flex flex-col items-center px-6"
          >
            <NavLink to={product.link}>
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-95 object-contain rounded-2xl shadow-lg bg-white"
              />
              <h3 className="mt-4 text-lg font-semibold text-center">{product.name}</h3>
            </NavLink>
          </div>
        ))}
      </motion.div>

      {/* Arrows only on md+ screens */}
      <div className="hidden md:block">
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-3 -translate-y-1/2 bg-white p-2 border rounded-full shadow hover:scale-110 transition"
        >
          <i className="ri-arrow-left-line text-2xl"></i>
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-white p-2 border rounded-full shadow hover:scale-110 transition"
        >
          <i className="ri-arrow-right-line text-2xl"></i>
        </button>
      </div>
    </div>
  );
};

export default Carousel;
