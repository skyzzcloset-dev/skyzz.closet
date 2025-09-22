import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Layouts & Pages
import MainLayout from "./layout/MainLayout";
import { Home, Login, Register } from "./pages";
import ErrorPage from "./pages/ErrorPage";
import Contact from "./pages/home/Contact";
import NewDrop from "./pages/home/NewDrop";
import AdminRoutes from "./routes/AdminRoutes";
import ProductLayout from "./ui/ProductLayout";

function App() {
  const { user } = useSelector((state) => state.auth || {});

  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />

          {/* Auth */}
          {!user ? (
            <>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </>
          ) : user?.role === "admin" ? (
            <>
              <Route
                path="login"
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route
                path="register"
                element={<Navigate to="/admin/dashboard" replace />}
              />
            </>
          ) : (
            <>
              <Route path="login" element={<Navigate to="/" replace />} />
              <Route path="register" element={<Navigate to="/" replace />} />
            </>
          )}

          {/* Public pages */}
          <Route path="new" element={<NewDrop />} />
          <Route path="contact" element={<Contact />} />
          <Route path="product/:id" element={<ProductLayout />} />

          {/* Catch-all */}
          <Route path="*" element={<ErrorPage />} />
        </Route>

        {/* Admin Layout */}
        {user?.role === "admin" ? (
          <Route path="/admin/*" element={<AdminRoutes />} />
        ) : (
          <Route path="/admin/*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
