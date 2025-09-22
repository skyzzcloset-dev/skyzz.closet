import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

// Lazy-loaded admin pages
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const AddProducts = lazy(() => import("../pages/admin/AddProducts"));
const Users = lazy(() => import("../pages/admin/Users"));
const Orders = lazy(() => import("../pages/admin/Orders"));
const Products = lazy(() => import("../pages/admin/Products"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));

const AdminRoutes = () => {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <Routes>
        <Route path="/admin/" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="add" element={<AddProducts />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
          {/* fallback for unknown admin routes */}
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
