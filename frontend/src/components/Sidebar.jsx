import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {NavLink, useNavigate} from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import {logout} from "../features/auth/authSlice";
import toast from "react-hot-toast";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate()
   const dispatch = useDispatch();

  const linkClasses = ({isActive}) =>
    `flex items-center p-2 rounded-lg transition group ${
      isActive
        ? "text-blue-700 dark:text-blue-400 bg-gray-100 dark:bg-gray-700"
        : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;

 
  const handleLogout = async () => {
    try {
      await dispatch(logout()); // if logout is async thunk
      toast.success("Logged Out");

      navigate("/");
    } catch (error) {
      toast.error(`Error: ${error.message || error}`);
    }
  };

  return (
    <>
      {/* Mobile hamburger (top right) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="inline-flex py-4 me-3 text-sm  rounded-lg 
                   focus:outline-none2
                    fixed top-0 right-5 z-50"
      >
        <span className="sr-only">Toggle sidebar</span>
        {isOpen ? (
          <div
            onClick={() => setIsOpen(false)}
            className="w-full lg:hidden md:hidden flex justify-start items-center"
          >
            <i className="ri-close-line text-2xl text-white cursor-pointer"></i>
          </div>
        ) : (
          <i className="ri-menu-line text-2xl"></i>
        )}
      </button>

      {/* Sidebar (shifted to right) */}
      <aside
        className={`fixed top-0 right-0 z-40 w-64 h-screen transition-transform bg-gray-50 
                    dark:bg-gray-800 ${
                      isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-15 lg:py-5 overflow-y-auto">
          {/* Close button for mobile */}

          <ul className="space-y-2 font-medium">
            <li>
              <NavLink to="/admin/dashboard" className={linkClasses}>
                <i className="ri-dashboard-line text-lg"></i>
                <span className="ms-3">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users" className={linkClasses}>
                <i className="ri-user-line text-lg"></i>
                <span className="ms-3">Users</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/products" className={linkClasses}>
                <i className="ri-box-3-line text-lg"></i>
                <span className="ms-3">Products</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/orders" className={linkClasses}>
                <i className="ri-bill-line text-lg"></i>
                <span className="ms-3">Orders</span>
              </NavLink>
            </li>
            <li>
              <NavLink onClick={handleLogout} to="/" className={linkClasses}>
                <i className="ri-logout-box-line text-lg"></i>
                <span className="ms-3">Sign Out</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
