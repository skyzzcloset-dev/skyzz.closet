// src/routes/MainRoutes.jsx
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Login, Register } from "../pages";
import MainLayout from "../layout/MainLayout";
import ErrorPage from "../pages/ErrorPage";
import Contact from "../pages/home/Contact";
import NewDrop from "../pages/home/NewDrop";

const MainRoutes = () => {
  const { user } = useSelector((state) => state.auth);

  return (
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
  );
};

export default MainRoutes;
