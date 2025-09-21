import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../../features/products/productSlice";
import ProductCard from "../../components/ProductCard";

const NewDrop = () => {
  const { items } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProduct());
  }, [dispatch]);

  // Reverse the items array safely
  const revArr = [...items].reverse();

  return (
    <div className="min-h-screen">
      <div className="w-full">
        <h1 className="text-center font-bold py-12 text-2xl lg:text-4xl">
          New Drop
        </h1>

        <div className=" mx-auto flex flex-wrap justify-center items-center lg:gap-20">
          {revArr.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewDrop;
