import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../../features/products/productSlice";
import ProductCard from "../../ui/ProductCard";
import Pagination from "../../components/Pagination";

const NewDrop = () => {
  const { items } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  useEffect(() => {
    dispatch(getAllProduct());
  }, [dispatch]);

  // Reverse array to show newest first
  const revArr = [...items].reverse();

  // Pagination logic
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = revArr.slice(firstPostIndex, lastPostIndex);

  return (
    <div className="lg:px-20  px-5">
      <div className="w-full py-10">
        <h1 className="text-center font-bold text-2xl pb-15  lg:text-4xl">
          New Drop
        </h1>

        <div className="mx-auto grid gap-15 justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {currentPosts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          totalPosts={revArr.length}
          postsPerPage={postsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default NewDrop;
