import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loadCartFromStorage, getCartItems } from "./features/cart/cartSlice";

// Lazy-loaded components
const MainLayout = lazy(() => import("./layout/MainLayout"));
const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const Contact = lazy(() => import("./pages/home/Contact"));
const NewDrop = lazy(() => import("./pages/home/NewDrop"));
const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));
const ProductLayout = lazy(() => import("./pages/home/ProductLayout"));
const Checkout = lazy(() =>import("./pages/checkout/Checkout"))
const Cart = lazy(() => import("./pages/shop/Cart"));

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});

  useEffect(() => {
    dispatch(loadCartFromStorage());
    if (user) dispatch(getCartItems());
  }, [dispatch, user]);

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />

            {!user ? (
              <>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </>
            ) : user?.role === "admin" ? (
              <>
                <Route path="login" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="register" element={<Navigate to="/admin/dashboard" replace />} />
              </>
            ) : (
              <>
                <Route path="login" element={<Navigate to="/" replace />} />
                <Route path="register" element={<Navigate to="/" replace />} />
              </>
            )}

            <Route path="new" element={<NewDrop />} />
            <Route path="contact" element={<Contact />} />
            <Route path="cart" element={<Cart />} />
            <Route path="product/:id" element={<ProductLayout />} />
            <Route path="checkout" element={<Checkout/>} />
            <Route path="*" element={<ErrorPage />} />
          </Route>

          {user?.role === "admin" ? (
            <Route path="/admin/*" element={<AdminRoutes />} />
          ) : (
            <Route path="/admin/*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
