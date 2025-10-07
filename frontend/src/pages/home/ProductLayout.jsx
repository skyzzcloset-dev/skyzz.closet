import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import { addCartItems } from "../../features/cart/cartSlice";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";

const ProductLayout = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  const dispatch = useDispatch();


  const defaultSizes = ["XS", "S", "M", "L", "XL"];

  // Fetch product data
  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/product/get/${id}`);
        const product = res.data.product;
        setItem(product);
        if (product.images?.length > 0) setSelectedImage(product.images[0].url);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleProduct();
  }, [id]);

  // Auto-select first available size & color
  useEffect(() => {
    if (item) {
      if (item.sizes?.length > 0) setSelectedSize(item.sizes[0]);
      if (item.colors?.length > 0) setSelectedColor(item.colors[0]);
    }
  }, [item]);

  // Add item to cart
  const handleAddToCart = async () => {
    if (!item) return;

    const cartData = {
      productId: item._id,
      quantity,
      sizes: selectedSize ? [selectedSize] : [],
      colors: selectedColor ? [selectedColor] : [],
    };

    try {
      const result = await dispatch(addCartItems(cartData)).unwrap();
      toast.success("Item added to cart successfully!");
    } catch (err) {
      toast.error(err?.message || "Please Login Again!!");
    }
  };

  const toggleLike = () => setLiked((prev) => !prev);

  if (loading) return <p className="p-6 text-center">Loading product...</p>;
  if (!item) return <p className="p-6 text-center text-red-500">Product not found</p>;

  return (
    <div className="lg:py-14 py-8 p-4 md:px-8 lg:px-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Product Image */}
        <div className="flex flex-col items-center">
          <LazyLoadImage
            src={selectedImage}
            alt={item.name}
            effect="blur"
            className="w-full max-w-md object-cover rounded-lg shadow-md"
          />
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            {item.images?.map((img) => (
              <LazyLoadImage
                key={img._id}
                src={img.url}
                alt="thumb"
                effect="blur"
                onClick={() => setSelectedImage(img.url)}
                className={`w-14 h-14 object-cover rounded-md cursor-pointer border ${
                  selectedImage === img.url ? "border-orange-500" : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold">{item.name}</h1>
            <button
              onClick={toggleLike}
              className="ml-3 text-red-500 text-xl md:text-2xl transition-transform hover:scale-110"
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-1">Item #{item.sku}</p>

          <p className="text-xl font-semibold text-orange-600 mt-3">₹{item.price}</p>
          <p className="mt-3 text-gray-700 text-sm leading-relaxed">{item.description}</p>

          {/* Colors */}
          {item.colors?.length > 0 && (
            <div className="mt-5">
              <h3 className="font-medium text-sm mb-1">Color</h3>
              <div className="flex gap-2 flex-wrap">
                {item.colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-md border text-sm font-medium transition ${
                      selectedColor === color
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-orange-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          <h3 className="font-medium text-sm mb-1 mt-5">Sizes</h3>
          <div className="flex gap-2 flex-wrap">
            {defaultSizes.map((size) => {
              const isAvailable = item.sizes?.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => isAvailable && setSelectedSize(size)}
                  disabled={!isAvailable}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border text-xs font-medium transition ${
                    selectedSize === size
                      ? "bg-orange-500 text-white border-orange-500"
                      : isAvailable
                      ? "bg-white text-gray-700 border-gray-300 hover:border-orange-400"
                      : "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>

          {/* Quantity Counter */}
          <div className="mt-4">
            <h3 className="font-medium text-sm mb-1">Quantity</h3>
            <div className="flex items-center border rounded-md w-28">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex-1 py-1.5 text-lg font-bold"
              >
                -
              </button>
              <span className="flex-1 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex-1 py-1.5 text-lg font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-md transition text-sm lg:text-xl"
            >
              Add to Cart
            </button>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductLayout;
