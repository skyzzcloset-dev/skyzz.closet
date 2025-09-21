import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { Logo } from "./index";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [active, setActive] = useState("home");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      toast.success("Logged Out");
      dispatch(reset());
      navigate("/login");
    } catch (error) {
      toast.error(`Error: ${error.message || error}`);
    }
  };

  const linkClasses = (name) =>
    `block py-2 px-3 rounded transition-colors duration-300 ${
      active === name ? "text-blue-700" : "text-black hover:text-blue-700"
    }`;

  return (
    <nav className="bg-white text-black border-b border-gray-200 shadow-sm fixed w-full z-50 px-5 md:px-20">
      <div className="relative flex items-center justify-between py-5">
        {/* Left side - Hamburger and Links */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 w-10 h-10 flex justify-center items-center rounded-lg hover:bg-gray-100 transition"
          >
            {isOpen ? (
              <i className="ri-close-line text-2xl"></i>
            ) : (
              <i className="ri-menu-line text-2xl"></i>
            )}
          </button>

          <ul className="hidden md:flex md:space-x-5 font-medium">
            <li>
              <NavLink
                to="/"
                onClick={() => setActive("home")}
                className={linkClasses("home")}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/shop"
                onClick={() => setActive("shop")}
                className={linkClasses("shop")}
              >
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/new"
                onClick={() => setActive("newdrop")}
                className={linkClasses("newdrop")}
              >
                New Drop
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                onClick={() => setActive("contact")}
                className={linkClasses("contact")}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Center - Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Logo />
        </div>

        {/* Right side - Search, Auth, Cart */}
        <div className="flex items-center  gap-4 ml-auto">
          {/* Desktop search */}
          <div className="hidden md:flex items-center space-x-5">
            {searchOpen ? (
              <div className="flex items-center gap-2 transition-all duration-300">
                <input
                  type="text"
                  placeholder="Search..."
                  autoFocus
                  className="w-[200px] p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <i
                  onClick={() => setSearchOpen(false)}
                  className="ri-close-line cursor-pointer text-xl"
                ></i>
              </div>
            ) : (
              <i
                onClick={() => setSearchOpen(true)}
                className="ri-search-line cursor-pointer text-xl hover:text-blue-700 transition"
              ></i>
            )}

            {user ? (
              <>
                <span className="ml-4 font-medium">Hi, {user.fullName?.firstName}</span>
                <button
                  onClick={handleLogout}
                  className="ml-4 text-red-500 hover:underline transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login">
                <i className="ri-user-line cursor-pointer text-xl ml-4 hover:text-blue-700 transition"></i>
              </NavLink>
            )}

            <NavLink to="/cart">
              <i className="ri-shopping-bag-2-line cursor-pointer text-xl ml-4 hover:text-blue-700 transition"></i>
            </NavLink>
          </div>

          {/* Mobile search icon */}
          <i
            onClick={() => setSearchOpen(true)}
            className="ri-search-line cursor-pointer text-xl md:hidden"
          ></i>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white z-40 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full justify-between p-6">
          <ul className="flex flex-col space-y-3 font-medium text-lg">
            <li>
              <NavLink
                to="/"
                onClick={() => {
                  setActive("home");
                  setIsOpen(false);
                }}
                className={linkClasses("home")}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/shop"
                onClick={() => {
                  setActive("shop");
                  setIsOpen(false);
                }}
                className={linkClasses("shop")}
              >
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/new"
                onClick={() => {
                  setActive("newdrop");
                  setIsOpen(false);
                }}
                className={linkClasses("newdrop")}
              >
                New Drop
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                onClick={() => {
                  setActive("contact");
                  setIsOpen(false);
                }}
                className={linkClasses("contact")}
              >
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Bottom section: Cart + Auth */}
          <div className="flex flex-col space-y-4 mt-6">
            <NavLink
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-black hover:text-blue-700 transition"
            >
              <i className="ri-shopping-bag-2-line text-xl"></i> Cart
            </NavLink>
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-red-500 hover:underline text-left transition"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-black hover:text-blue-700 transition"
              >
                <i className="ri-user-line text-xl"></i> Login
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 flex items-start p-4">
          <div className="flex w-full items-center gap-2">
            <i className="ri-search-line text-xl"></i>
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <i
              onClick={() => setSearchOpen(false)}
              className="ri-close-line cursor-pointer text-2xl"
            ></i>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
