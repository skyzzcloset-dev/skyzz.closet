import React from "react";
import { Route } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import AddProducts from "../pages/admin/AddProducts";
import Users from "../pages/admin/Users";
import ErrorPage from "../pages/ErrorPage";
import Orders from "../pages/admin/Orders";
import Products from "../pages/admin/Products";

const AdminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="products" element={<Products />} />
    <Route path="products/add" element={<AddProducts />} />
    <Route path="users" element={<Users />} />
    <Route path="orders" element={<Orders />} />
    {/* fallback for unknown admin routes */}
    <Route path="*" element={<ErrorPage />} />
  </Route>
);

export default AdminRoutes;
