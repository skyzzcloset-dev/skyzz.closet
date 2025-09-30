import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch } from "react-redux";
import { addCartItems } from "../features/cart/cartSlice"
import "react-lazy-load-image-component/src/effects/blur.css";

const ProductLayout = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/product/get/${id}`
        );
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

  const handleAddToCart = () => {
    if (!item) return;

    const cartData = {
      productId: item._id,
      name: item.name,
      price: item.price,
      image: selectedImage || item.images?.[0]?.url,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    };

    dispatch(addCartItems(cartData));
  };

  if (loading) return <p className="p-6 text-center">Loading product...</p>;
  if (!item) return <p className="p-6 text-center text-red-500">Product not found</p>;

  return (
    <div className="lg:py-18 py-10 md:px-10 lg:px-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Product Image */}
        <div className="flex flex-col items-center">
          <LazyLoadImage
            src={selectedImage}
            alt={item.name}
            effect="blur"
            className="w-full max-w-md object-cover rounded-lg shadow-md"
          />
          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 flex-wrap justify-center">
            {item.images?.map((img) => (
              <LazyLoadImage
                key={img._id}
                src={img.url}
                alt="thumb"
                effect="blur"
                onClick={() => setSelectedImage(img.url)}
                className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${
                  selectedImage === img.url
                    ? "border-orange-500"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold">{item.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Item #{item.sku}</p>
          <p className="text-2xl font-semibold text-orange-600 mt-4">
            ₹{item.price}
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed">{item.description}</p>

          {/* Colors */}
          {item.colors?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex gap-3 flex-wrap">
                {item.colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-md border ${
                      selectedColor === color
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {item.sizes?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Size</h3>
              <div className="flex gap-3 flex-wrap">
                {item.sizes.map((size) => (
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
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductLayout;
