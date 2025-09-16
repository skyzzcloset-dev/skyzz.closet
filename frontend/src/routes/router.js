import { createBrowserRouter } from "react-router-dom";
import MainRoutes from "./MainRoutes";
import AdminRoutes from "./AdminRoutes";

import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainRoutes />, // ✅ JSX element, not function
    children: [
      { path: "/", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminRoutes />, // ✅ JSX element
  },
]);

export default router;
