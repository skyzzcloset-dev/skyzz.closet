import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { Logo } from "./index";
import { toast } from "react-toastify";

// React Icons
import { FiMenu, FiX, FiSearch, FiUser, FiShoppingBag } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [active, setActive] = useState("home");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

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
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
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
        <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
          <Logo />
        </div>

        {/* Right side - Search, Auth, Cart */}
        <div className="hidden md:flex items-center gap-4 ml-auto z-20 relative">
          {searchOpen ? (
            <div className="flex items-center gap-2 transition-all duration-300">
              <input
                type="text"
                placeholder="Search..."
                autoFocus
                className="w-[200px] p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <FiX
                size={20}
                className="cursor-pointer"
                onClick={() => setSearchOpen(false)}
              />
            </div>
          ) : (
            <FiSearch
              size={20}
              className="cursor-pointer hover:text-blue-700 transition"
              onClick={() => setSearchOpen(true)}
            />
          )}

          {user ? (
            <>
              <span className="ml-4 font-medium">Hi, {user.username}</span>
              <button
                onClick={handleLogout}
                className="ml-4 text-red-500 hover:underline transition"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login">
              <FiUser
                size={20}
                className="cursor-pointer ml-4 hover:text-blue-700 transition"
              />
            </NavLink>
          )}

          {/* Desktop Cart with Counter */}
          <NavLink to="/cart" className="relative">
            <FiShoppingBag
              size={20}
              className="cursor-pointer ml-4 hover:text-blue-700 transition"
            />
            {cartItems && cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </NavLink>
        </div>

        {/* Mobile search icon */}
        <FiSearch
          size={20}
          className="cursor-pointer md:hidden"
          onClick={() => setSearchOpen(true)}
        />
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full justify-between p-6">
          <ul className="flex flex-col font-medium text-lg">
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
              className="relative flex items-center gap-2 text-black hover:text-blue-700 transition"
            >
              <FiShoppingBag size={20} /> Cart
              {cartItems && cartItems.length > 0 && (
                <span className="absolute left-6 -top-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
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
                <FiUser size={20} /> Login
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 flex items-start p-4">
          <div className="flex w-full items-center gap-2">
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <FiX
              size={24}
              className="cursor-pointer"
              onClick={() => setSearchOpen(false)}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
