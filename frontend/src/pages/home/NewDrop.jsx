import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../../features/products/productSlice";
import ProductCard from "../../ui/ProductCard";

const NewDrop = () => {
  const { items } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProduct());
  }, [dispatch]);

  // Reverse the items array safely
  const revArr = [...items].reverse();

  return (
    <div className="min-h-screen px-4">
      <div className="w-full">
        <h1 className="text-center font-bold py-12 text-2xl lg:text-4xl">
          New Drop
        </h1>

        <div className="mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {revArr.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewDrop;
