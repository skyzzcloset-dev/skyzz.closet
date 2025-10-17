import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch } from "react-redux";
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

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        const res = await axios.get(
          `https://product-production-4bd9.up.railway.app/api/product/get/${id}`
        );
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

  useEffect(() => {
    if (item) {
      if (item.sizes?.length > 0) setSelectedSize(item.sizes[0]);
      if (item.colors?.length > 0) setSelectedColor(item.colors[0]);
    }
  }, [item]);

  const handleAddToCart = async () => {
    if (!item) return;
    const cartData = {
      productId: item._id,
      quantity,
      sizes: selectedSize ? [selectedSize] : [],
      colors: selectedColor ? [selectedColor] : [],
    };
    try {
      await dispatch(addCartItems(cartData)).unwrap();
      toast.success("Item added to cart successfully!");
    } catch (err) {
      toast.error(err?.message || "Please Login to add items");
    }
  };

  const toggleLike = () => setLiked((prev) => !prev);

  if (loading) return <p className="p-6 text-center">Loading product...</p>;
  if (!item)
    return <p className="p-6 text-center text-red-500">Product not found</p>;

  return (
    <div className="py-8 md:py-14 px-4 sm:px-6 md:px-8 lg:px-16">
      <div className="flex flex-col md:flex-row gap-8 md:gap-10 lg:gap-14">
        {/* Left: Product Images */}
        <div className="flex flex-col items-center md:w-1/2">
          <div className="w-full max-w-md rounded-lg overflow-hidden shadow-md">
            <LazyLoadImage
              src={selectedImage}
              alt={item.name}
              effect="blur"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Thumbnail Scroll */}
          {item.images?.length > 1 && (
            <div className="flex gap-2 mt-4 w-full overflow-x-auto scrollbar-hide scroll-smooth snap-x">
              {item.images?.map((img) => (
                <div key={img._id} className="snap-center">
                  <LazyLoadImage
                    src={img.url}
                    alt="thumb"
                    effect="blur"
                    onClick={() => setSelectedImage(img.url)}
                    className={`w-20 h-20 object-cover rounded-md cursor-pointer flex-shrink-0 border transition ${
                      selectedImage === img.url
                        ? "border-orange-500 ring-2 ring-orange-200"
                        : "border-gray-300 hover:border-orange-400"
                    }`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex-1 flex flex-col space-y-5">
          {/* Title + Like */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                {item.name}
              </h1>
              <p className="text-gray-500 text-sm mt-1">Item #{item.sku}</p>
            </div>
            <button
              onClick={toggleLike}
              className="ml-3 text-red-500 text-2xl md:text-3xl transition-transform hover:scale-110"
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>

          {/* Price */}
          <p className="text-2xl font-bold text-orange-600">₹{item.price}</p>

          {/* Description */}
          <div className="bg-gray-50 border rounded-lg p-3 text-sm md:text-base text-gray-700 leading-relaxed max-h-48 overflow-y-auto">
            {item.description || "No description available."}
          </div>

          {/* Colors */}
          {item.colors?.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-2 uppercase tracking-wide text-gray-700">
                Color
              </h3>
              <div className="flex gap-2 flex-wrap">
                {item.colors?.join(",").split(",").map((color, idx) => (
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
          <div>
            <h3 className="font-semibold text-sm mb-2 uppercase tracking-wide text-gray-700">
              Size
            </h3>
            <div className="flex gap-2 flex-wrap">
              {defaultSizes.map((size) => {
                const isAvailable = item.sizes?.join(",").split(",").includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => isAvailable && setSelectedSize(size)}
                    disabled={!isAvailable}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border text-xs font-semibold transition ${
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
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-semibold text-sm mb-2 uppercase tracking-wide text-gray-700">
              Quantity
            </h3>
            <div className="flex items-center border rounded-md w-32">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex-1 py-1.5 text-lg font-bold hover:bg-gray-100"
              >
                -
              </button>
              <span className="flex-1 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex-1 py-1.5 text-lg font-bold hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-md transition text-base md:text-lg"
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
