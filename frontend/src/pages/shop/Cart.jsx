import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { deleteCart, updateCart } from "../../features/cart/cartSlice";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        if (cartItems.length === 0) {
          setProducts([]);
          return;
        }

        const productRequests = cartItems.map((item) =>
          axios.get(
            `https://product-production-4bd9.up.railway.app/api/product/get/${item.productId}`
          )
        );

        const responses = await Promise.all(productRequests);

        const fetchedProducts = responses.map((res, index) => ({
          ...res.data.product,
          quantity: cartItems[index].quantity,
          sizes: cartItems[index].sizes || res.data.product.sizes || [],
          colors: cartItems[index].colors || res.data.product.colors || [],
          selectedSize:
            cartItems[index].sizes?.[0] || res.data.product.sizes?.[0] || "Default",
        }));

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching cart products:", error);
      }
    };

    fetchCartProducts();
  }, [cartItems]);

  const handleQuantityChange = (productId, newQty) => {
    dispatch(updateCart({ id: productId, cartData: { quantity: newQty } }));
  };

  const handleDelete = (productId) => {
    try {
      dispatch(deleteCart({ id: productId }));
      toast.success("Cart Item Deleted!!");
    } catch (error) {
      toast.error("Error deleting cart item");
    }
  };

  const handleSizeChange = (productId, size) => {
    dispatch(updateCart({ id: productId, cartData: { sizes: [size] } }));
  };

  const totalPrice = products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-20">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Your Cart
      </h1>

      {products.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex flex-col sm:flex-row justify-between bg-white rounded-xl shadow-sm p-5 border border-gray-100 transition hover:shadow-md"
              >
                {/* Product Info */}
                <div className="flex items-start gap-4 w-full sm:w-auto">
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    className="w-24 h-28 sm:w-28 sm:h-32 object-cover rounded-md border border-gray-100"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {product.name}
                    </h2>
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      ₹{product.price}
                    </p>

                    {/* Size Selector */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500">Size:</span>
                      <select
                        value={product.selectedSize}
                        onChange={(e) =>
                          handleSizeChange(product._id, e.target.value)
                        }
                        className="text-xs border rounded-md px-2 py-1 bg-gray-50 focus:ring-1 focus:ring-orange-500"
                      >
                        {product.sizes?.length > 0 ? (
                          product.sizes.map((size, idx) => (
                            <option key={idx} value={size}>
                              {size}
                            </option>
                          ))
                        ) : (
                          <option value="Default">Default</option>
                        )}
                      </select>
                    </div>

                    <p className="text-gray-500 text-xs">
                      Color: {product.colors?.[0] || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Quantity, Delete, and Total */}
                <div className="flex  sm:flex-row sm:items-center justify-between sm:justify-end gap-4 sm:gap-6 mt-4 sm:mt-0  sm:w-auto">
                  {/* Quantity Controls */}
                  <div className="flex items-center border rounded-full overflow-hidden shadow-sm bg-gray-50 w-25">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          product._id,
                          Math.max(1, product.quantity - 1)
                        )
                      }
                      className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-200 transition"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-gray-800 font-medium">
                      {product.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(product._id, product.quantity + 1)
                      }
                      className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-200 transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 text-red-500 text-lg transition"
                    title="Remove Item"
                  >
                    🗑
                  </button>

                  {/* Total */}
                  <div className="font-semibold text-gray-800 text-center sm:text-right text-xl whitespace-nowrap">
                    ₹{product.price * product.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6 h-fit border border-gray-100 sticky top-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Order Summary
            </h2>

            <div className="flex justify-between mb-2 text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>

            <div className="flex justify-between mb-2 text-sm text-gray-600">
              <span>Shipping</span>
              <span className="text-gray-400">Calculated at checkout</span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between text-lg font-bold text-gray-800">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>

            <NavLink to="/checkout">
              <button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
                Proceed to Checkout
              </button>
            </NavLink>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            className="w-40 h-40 mb-4 opacity-80"
          />
          <p className="text-gray-500 text-center text-lg">
            Your cart is empty 🛒
          </p>
        </div>
      )}
    </div>
  );
};

export default Cart;
