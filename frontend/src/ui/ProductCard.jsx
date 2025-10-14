import React from "react";
import { NavLink } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

const ProductCard = ({ product }) => {
  const imageUrl = product.img || product.images?.[0]?.url;

  return (
    <NavLink to={`/product/${product._id}`} className="flex justify-center w-full">
      <div className="w-full max-w-[320px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-[300px] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:scale-105 bg-white">
        <LazyLoadImage
          src={imageUrl}
          alt={product.name}
          effect="blur"
          className="w-full  object-cover"
        />
        <div className="p-2 sm:p-3 text-center">
          <h2 className="font-semibold text-sm sm:text-md md:text-md lg:text-lg truncate">{product.name}</h2>
          {product.brand && <p className="text-gray-500 text-xs sm:text-sm truncate">{product.brand}</p>}
          {product.price && <p className="font-bold text-sm sm:text-md md:text-md lg:text-md mt-1">₹{product.price}</p>}
        </div>
      </div>
    </NavLink>
  );
};

export default ProductCard;
