import React, {lazy, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {ChevronDown, ChevronUp} from "lucide-react";
import productService from "../../features/products/productService";
import Search from "../../components/Search";

const ProductCard = lazy(() => import("../../ui/ProductCard"));
const Pagination = lazy(() => import("../../components/Pagination"));

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const postsPerPage = 8;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getAllProduct({
          ...filters,
          category: category || filters.category,
        });
        setProducts(res.products || []);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters, category]);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = products.slice(firstPostIndex, lastPostIndex);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading products...
        </p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          No products found
        </h2>
        <p className="text-gray-500 text-sm">
          Try adjusting your filters or exploring other categories.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 lg:px-5 py-10">
      <div className="flex flex-col lg:flex-row gap-5 relative">
        {/* Sidebar for desktop */}
        <aside className="lg:w-1/4  hidden lg:block">
          <Search onFilterChange={setFilters} isOpen={true} />
        </aside>

        {/* Products Section */}
        <main className="flex-1">
          {/* Header + Filter Button */}
          <div className="flex items-center justify-center mb-1 relative">
            <h1 className="text-2xl sm:text-3xl font-bold capitalize">
              {category || "All Products"}
            </h1>
            {/* <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md shadow hover:bg-orange-600 transition"
              >
                <span>Filters</span>
                {isFilterOpen ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

             
              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-2 w-[300px] z-50">
                  <Search onFilterChange={setFilters} isOpen={true} />
                </div>
              )}
            </div> */}
          </div>

          <p className="text-gray-500 mb-10 text-center text-sm">
            Showing {products.length}{" "}
            {products.length === 1 ? "product" : "products"}
          </p>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center">
            {currentPosts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

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
        </main>
      </div>
    </div>
  );
};

export default Shop;
