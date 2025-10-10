import React, {useEffect, useState} from "react";
import axios from "axios";
import {useSelector, useDispatch} from "react-redux";
import {deleteCart, updateCart} from "../../features/cart/cartSlice";
import {toast} from "react-toastify";
import {NavLink} from "react-router-dom";

const Cart = () => {
  const {cartItems} = useSelector((state) => state.cart);
  console.log(cartItems);

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
          axios.get(`http://localhost:8000/api/product/get/${item.productId}`)
        );

        const responses = await Promise.all(productRequests);

        const fetchedProducts = responses.map((res, index) => ({
          ...res.data.product,
          quantity: cartItems[index].quantity,
          sizes: cartItems[index].sizes,   // ✅ fixed
          colors: cartItems[index].colors, // ✅ already correct
        }));

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching cart products:", error);
      }
    };

    fetchCartProducts();
  }, [cartItems]);

  const handleQuantityChange = (productId, newQty) => {
    dispatch(updateCart({id: productId, cartData: {quantity: newQty}}));
  };

  const handleDelete = (productId) => {
    try {
      dispatch(deleteCart({id: productId}));
      toast.success("Cart Item Deleted!!");
    } catch (error) {
      toast.error("Error deleting cart item");
    }
  };

  const totalPrice = products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-20">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Your Cart</h1>

      {products.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-6 gap-4"
              >
                {/* Product Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    className="w-24 h-28 object-cover rounded-md"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="text-gray-600 text-sm">₹{product.price}</p>
                    <p className="text-gray-500 text-xs">
                      Size:{" "}
                      {Array.isArray(product.sizes)
                        ? product.sizes.join(", ")
                        : product.sizes || "N/A"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Color: {product.colors?.[0] || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Quantity + Remove + Total */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 mt-3 sm:mt-0">
                  {/* Quantity controls */}
                  <div className="flex items-center border rounded-md w-fit mx-auto sm:mx-0">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          product._id,
                          Math.max(1, product.quantity - 1)
                        )
                      }
                      className="px-3 py-1 text-lg"
                    >
                      -
                    </button>
                    <span className="px-3">{product.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(product._id, product.quantity + 1)
                      }
                      className="px-3 py-1 text-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-500 hover:text-red-700 mt-2 sm:mt-0 text-center"
                  >
                    🗑
                  </button>

                  {/* Item Total */}
                  <div className="font-semibold text-center sm:text-right mt-2 sm:mt-0">
                    ₹{product.price * product.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2 text-sm">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Shipping</span>
              <span className="text-gray-500">Calculated at checkout</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
            <NavLink to="/checkout">
              <button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition">
                Checkout
              </button>
            </NavLink>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-20">Your cart is empty</p>
      )}
    </div>
  );
};

export default Cart;
