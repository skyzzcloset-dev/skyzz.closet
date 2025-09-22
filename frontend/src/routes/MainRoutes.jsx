// src/routes/MainRoutes.jsx
import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "../layout/MainLayout";
import ProductLayout from "../ui/ProductLayout";

// Lazy-loaded pages
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Contact = lazy(() => import("../pages/home/Contact"));
const NewDrop = lazy(() => import("../pages/home/NewDrop"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));

const MainRoutes = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />

          {/* Auth */}
          {!user ? (
            <>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </>
          ) : (
            <>
              <Route path="login" element={<Navigate to="/" replace />} />
              <Route path="register" element={<Navigate to="/" replace />} />
            </>
          )}

          {/* Main */}
          <Route path="new" element={<NewDrop />} />
          <Route path="contact" element={<Contact />} />
         

          {/* Catch-all for 404 */}
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default MainRoutes;
