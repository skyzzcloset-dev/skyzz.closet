import React, { useEffect, useState } from "react";

const subCategories = ["Dress", "Tops", "Bottoms", "Shirts"];
const sizes = ["S", "M", "L", "XL"];

const Search = ({ onFilterChange, isOpen }) => {
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [price, setPrice] = useState(500);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [availability, setAvailability] = useState("");

//   useEffect(() => {
//     const filters = {
//       category: selectedSubCategory !== "All" ? selectedSubCategory : undefined,
//       maxPrice: price,
//       sizes: selectedSizes.length ? selectedSizes : undefined,
//       availability: availability || undefined,
//     };
//     onFilterChange(filters);
//   }, [selectedSubCategory, price, selectedSizes, availability, onFilterChange]);

  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <div
      id="filter-panel"
      className={`bg-white rounded-xl border border-gray-200 shadow-lg p-10 transition-all duration-300
      ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}
      lg:max-h-full lg:opacity-100 lg:block`}
    >
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-gray-800">Sub-Category</h3>
        <div className="flex flex-wrap gap-2">
          {subCategories.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedSubCategory(item)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedSubCategory === item
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-gray-800">Price Range</h3>
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full accent-orange-500 cursor-pointer"
        />
        <div className="flex justify-between text-sm mt-1 text-gray-600">
          <span>₹0</span>
          <span>₹{price.toLocaleString()}</span>
          <span>₹10,000</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-gray-800">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                selectedSizes.includes(size)
                  ? "bg-orange-100 text-orange-600 font-medium"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2 text-gray-800">Availability</h3>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setAvailability(availability === "inStock" ? "" : "inStock")
            }
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              availability === "inStock"
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            In Stock
          </button>
          <button
            onClick={() =>
              setAvailability(
                availability === "outOfStock" ? "" : "outOfStock"
              )
            }
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              availability === "outOfStock"
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Out of Stock
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;
