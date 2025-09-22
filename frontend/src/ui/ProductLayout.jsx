import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductLayout = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        const res = await axios.get(`https://skyzz-closet-1.onrender.com/api/product/get/${id}`);
        const product = res.data.product;
        setItem(product);
        if (product.images?.length > 0) {
          setSelectedImage(product.images[0].url);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleProduct();
  }, [id]);

  if (loading) return <p className="p-6">Loading product...</p>;
  if (!item) return <p className="p-6 text-red-500">Product not found</p>;

  return (
    <div className="p-15 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Product Image */}
        <div className="flex flex-col items-center">
          <img
            src={selectedImage}
            alt={item.name}
            className="w-full max-w-md h-auto object-cover rounded-lg shadow-md"
          />
          {/* Thumbnails */}
          <div className="flex gap-3 mt-4">
            {item.images?.map((img) => (
              <img
                key={img._id}
                src={img.url}
                alt="thumb"
                onClick={() => setSelectedImage(img.url)}
                className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${
                  selectedImage === img.url ? "border-orange-500" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{item.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Item #{item.sku}</p>
          <p className="text-2xl font-semibold text-orange-600 mt-4">₹{item.price}</p>
          <p className="mt-4 text-gray-700 leading-relaxed">{item.description}</p>

          {/* Colors */}
          <div className="mt-6">
            <h3 className="font-medium mb-2">Color</h3>
            <div className="flex gap-3">
              {item.colors?.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? "border-orange-500" : "border-gray-300"
                  }`}
                  title={color}
                  style={{ backgroundColor: "#e5e5e5" }} // You can map actual colors if available
                ></button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mt-6">
            <h3 className="font-medium mb-2">Size</h3>
            <div className="flex gap-3">
              {item.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-md border ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-white text-black border-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Bag Button */}
          <button className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-md transition">
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductLayout;
