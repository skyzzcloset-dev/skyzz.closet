import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/orders/orderSlice";
import paymentReducer from "../features/payment/paymentSlice";
import deliveryReducer from "../features/delivery/deliverySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    order: orderReducer,
    payment: paymentReducer,
    delivery: deliveryReducer,
  },
});
