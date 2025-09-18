import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { Logo } from "./index";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(false);
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
      active === name
        ? "text-blue-700 md:text-blue-700"
        : "text-black hover:text-blue-700"
    }`;

  return (
    <nav className="bg-white text-black border-b border-gray-200 shadow-sm fixed w-full z-50">
      <div className="max-w-screen-xl mx-auto p-4 grid grid-cols-3 items-center">
        {/* Left side */}
        <div className="flex items-center">
          {/* Hamburger (mobile only) */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-700 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
          >
            <span className="sr-only">Toggle menu</span>
            {isOpen ? (
              <i className="ri-close-line text-2xl"></i>
            ) : (
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            )}
          </button>

          {/* Links (desktop only) */}
          <ul className="hidden md:flex md:space-x-10 font-medium ml-6">
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

        {/* Center (Logo) */}
        <div className="flex justify-center">
          <Logo />
        </div>

        {/* Right side */}
        <div className="flex items-center justify-end gap-5">
          {/* Desktop search */}
          <div className="hidden md:flex items-center gap-4">
            {search ? (
              <div className="flex items-center gap-2 transition-all duration-300">
                <i className="ri-search-line text-xl"></i>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-[150px] p-2 text-sm text-black border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <i
                  onClick={() => setSearch(false)}
                  className="ri-close-line cursor-pointer text-xl"
                ></i>
              </div>
            ) : (
              <i
                onClick={() => setSearch(true)}
                className="ri-search-line cursor-pointer text-xl transition-all hover:text-blue-700"
              ></i>
            )}

            {/* Auth condition */}
            {user ? (
              <>
                <span className="font-medium">Hi, {user.fullName?.firstName}</span>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:underline transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login">
                <i className="ri-user-line cursor-pointer text-xl transition-all hover:text-blue-700"></i>
              </NavLink>
            )}

            <NavLink to="/cart">
              <i className="ri-shopping-bag-2-line cursor-pointer text-xl transition-all hover:text-blue-700"></i>
            </NavLink>
          </div>

          {/* Mobile search icon */}
          <i
            onClick={() => setSearch(true)}
            className="ri-search-line cursor-pointer text-xl md:hidden"
          ></i>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white z-40 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full justify-between p-6">
          <ul className="flex flex-col space-y-4 font-medium">
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

          {/* Bottom section: Cart + Logout */}
          <div className="flex flex-col space-y-4">
            <NavLink
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-black hover:text-blue-700 transition-all"
            >
              <i className="ri-shopping-bag-2-line text-xl"></i> Cart
            </NavLink>
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-red-500 hover:underline transition-all text-left"
              >
                Logout
              </button>
            )}
            {!user && (
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-black hover:text-blue-700 transition-all"
              >
                <i className="ri-user-line text-xl"></i> Login
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      {search && (
        <div className="md:hidden fixed inset-0 bg-white z-50 flex items-start p-4 transition-all">
          <div className="flex w-full items-center gap-2">
            <i className="ri-search-line text-xl"></i>
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <i
              onClick={() => setSearch(false)}
              className="ri-close-line cursor-pointer text-2xl"
            ></i>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
