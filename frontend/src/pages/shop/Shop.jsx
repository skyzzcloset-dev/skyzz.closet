import React, {lazy, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import productService from "../../features/products/productService";

const ProductCard = lazy(() => import("../../ui/ProductCard"));
const Pagination = lazy(() => import("../../components/Pagination"));

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category"); // e.g., "shirts"

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Pass category as a query param for optimized backend filtering
        const res = await productService.getAllProduct(
          category ? {category} : {}
        );
        setProducts(res.products || []);
        setCurrentPage(1); // Reset to first page on category change
      } catch (err) {
        console.error("Error fetching products", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // Pagination logic
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = products.slice(firstPostIndex, lastPostIndex);

  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500">Loading products...</p>
    );
  }

  if (!products.length) {
    return (
      <p className="text-center h-screen mt-20 text-gray-500">
        No products found in this category.
      </p>
    );
  }

  return (
    <div className="px-5 lg:px-25 py-10">
      <h1 className="text-5xl text-center lg:text-left mb-8 font-bold">{category}</h1>
      <div className=" mx-auto">
        {/* Products Grid */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center mb-5">
          {currentPosts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {products.length > postsPerPage && (
          <div className="mt-10 flex justify-center">
            <Pagination
              totalPosts={products.length}
              postsPerPage={postsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
