import React from "react";
import { NavLink } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

const ProductCard = ({ product }) => {
  const imageUrl = product.img || product.images?.[0]?.url;

  return (
    <NavLink to={`/product/${product._id}`} className="flex justify-center">
      <div className="w-full max-w-[280px] sm:max-w-[300px] md:max-w-[280px] lg:max-w-[300px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 bg-white">
        <LazyLoadImage
          src={imageUrl}
          alt={product.name}
          effect="blur" // lazy load blur effect
          className="w-full object-cover h-75"
        />
        <div className="p-4 text-center">
          <h2 className="font-semibold text-lg">{product.name}</h2>
          {product.brand && <p className="text-gray-500 mt-1">{product.brand}</p>}
          {product.price && <p className="font-bold mt-2">₹{product.price}</p>}
        </div>
      </div>
    </NavLink>
  );
};

export default ProductCard;
