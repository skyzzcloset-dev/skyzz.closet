import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {useDispatch} from "react-redux";
import {addCartItems} from "../../features/cart/cartSlice";
import {FaHeart, FaRegHeart} from "react-icons/fa";
import toast from "react-hot-toast";
import "react-lazy-load-image-component/src/effects/blur.css";

const ProductLayout = () => {
  const {id} = useParams();
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

  const toggleLike = () => setLiked((p) => !p);

  if (loading)
    return (
      <div className="flex items-center justify-center h-60">
        <span className="text-gray-500 text-lg">Loading product...</span>
      </div>
    );

  if (!item)
    return (
      <div className="flex items-center justify-center h-60">
        <span className="text-red-500 text-lg">Product not found</span>
      </div>
    );

  const stockMessage =
    item.stock === 0
      ? "Out of Stock"
      : item.stock <= 5
      ? `Only ${item.stock} left!`
      : "In Stock";

  // ✅ Fix: Convert "S,M" → ["S","M"]
  const availableSizes = Array.isArray(item.sizes)
    ? item.sizes
    : item.sizes[0]?.split(",") || [];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-10 md:py-14">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Image Gallery */}
        <div className="lg:w-1/2 flex flex-col items-center gap-4">
          <div className="w-full h-[350px] lg:h-[450px] max-w-[480px] bg-white rounded-2xl shadow-md overflow-hidden relative flex items-center justify-center">
            <LazyLoadImage
              src={selectedImage}
              alt={item.name}
              effect="blur"
              className="max-w-full h-[350px] lg:h-[500px] rounded-2xl transition-transform duration-500 hover:scale-105 object-contain"
            />
            <button
              onClick={toggleLike}
              className="absolute top-4 right-4 text-3xl text-white bg-black/40 rounded-full p-2 backdrop-blur-md"
            >
              {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </button>
          </div>

          {item.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto  scrollbar-hide p-1">
              {item.images.map((img) => (
                <button
                  key={img._id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`rounded-xl h-25 overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === img.url
                      ? "border-orange-500 scale-105"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <LazyLoadImage
                    src={img.url}
                    alt="thumb"
                    className="w-20 h-25 object-cover"
                    effect="blur"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
            <p className="text-gray-500 text-sm mt-1">SKU: {item.sku}</p>
          </div>

          <div>
            <div className="text-3xl font-extrabold text-orange-600">
              ₹{item.price}
            </div>
            <div
              className={`mt-2 text-sm font-medium px-3 py-1 rounded-lg w-fit ${
                stockMessage.toLowerCase().includes("out")
                  ? "bg-red-100 text-red-600 border border-red-200"
                  : stockMessage.toLowerCase().includes("only")
                  ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                  : "bg-green-100 text-green-600 border border-green-200"
              }`}
            >
              {stockMessage}
            </div>
          </div>

          <p className="text-gray-700 bg-gray-50 border border-gray-200 rounded-xl p-4 text-base leading-relaxed max-h-40 overflow-y-auto">
            {item.description || "No description available."}
          </p>

          {item.colors?.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-2 uppercase text-gray-700">
                Colors
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      selectedColor === color
                        ? "bg-orange-500 text-white border-orange-500 shadow-md"
                        : "bg-white text-gray-800 border-gray-300 hover:border-orange-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-sm mb-2 uppercase text-gray-700">
              Sizes
            </h3>
            <div className="flex flex-wrap gap-3">
              {defaultSizes.map((size) => {
                const availableSizes =
                  Array.isArray(item.sizes) &&
                  item.sizes.length === 1 &&
                  item.sizes[0].includes(",")
                    ? item.sizes[0].split(",").map((s) => s.trim())
                    : item.sizes;

                console.log(availableSizes);

                const isAvailable = availableSizes.includes(size);
                console.log(isAvailable);

                return (
                  <button
                    key={size}
                    onClick={() => isAvailable && setSelectedSize(size)}
                    disabled={!isAvailable}
                    className={`w-12 h-12 flex items-center justify-center rounded-full border text-xs font-bold transition-all duration-200
            ${
              selectedSize === size
                ? "bg-orange-500 text-white border-orange-500 shadow"
                : isAvailable
                ? "bg-white text-gray-800 border-gray-300 hover:border-orange-400"
                : "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
            }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2 uppercase text-gray-700">
              Quantity
            </h3>
            <div className="flex items-center w-36 border rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex-1 py-2 text-lg font-bold hover:bg-gray-100"
              >
                -
              </button>
              <span className="flex-1 text-center text-base">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex-1 py-2 text-lg font-bold hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 text-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductLayout;
