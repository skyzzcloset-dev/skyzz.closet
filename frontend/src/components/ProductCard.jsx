import React from "react";

const ProductCard = ({ product }) => {
  return (
    
    <div className=" w-90 h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-transform transform hover:scale-105  ">
      <img
        src={product.img || product.images?.[0]?.url}
        alt={product.name}
        className="w-full h-84 object-center bg-white"
      />
      <div className="p-4 text-center">
        <h2 className="font-semibold text-lg">{product.name}</h2>
        {product.brand && <p className="text-gray-500">{product.brand}</p>}
        {product.price && <p className="font-bold mt-2">₹{product.price}</p>}
      </div>
    </div>
  );
};

export default ProductCard;
