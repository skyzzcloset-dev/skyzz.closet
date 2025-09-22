import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const AddProducts = lazy(() => import("../pages/admin/AddProducts"));
const Users = lazy(() => import("../pages/admin/Users"));
const Orders = lazy(() => import("../pages/admin/Orders"));
const Products = lazy(() => import("../pages/admin/Products"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));

const AdminRoutes = () => {
  return (
    <Routes>
      <Route  element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="add" element={<AddProducts />} />
        <Route path="users" element={<Users />} />
        <Route path="orders" element={<Orders />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
