import React, {useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {logout, reset} from "../features/auth/authSlice";
import {Logo} from "./index";
import {toast} from "react-toastify";
import {FiMenu, FiX, FiSearch, FiUser, FiChevronDown} from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [shopOpen, setShopOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);
  const {cartItems} = useSelector((state) => state.cart);

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
        {/* Left side - Hamburger */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 w-10 h-10 flex justify-center items-center rounded-lg hover:bg-gray-100 transition"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Desktop Menu */}
          <ul className="hidden md:flex md:space-x-5 font-medium relative">
            <li>
              <NavLink
                to="/"
                onClick={() => setActive("home")}
                className={linkClasses("home")}
              >
                Home
              </NavLink>
            </li>

            {/* Shop dropdown */}
            <li className="relative">
              <button
                onClick={() => setShopOpen((prev) => !prev)}
                className="flex items-center gap-1 py-2 px-3 rounded hover:text-blue-700 transition"
              >
                Shop <FiChevronDown size={16} />
              </button>
              {shopOpen && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200">
                  {["Dress", "Tops", "Bottoms", "Shirts"].map((cat) => (
                    <NavLink
                      key={cat}
                      to={`/shop?category=${cat}`}
                      onClick={() => {
                        setActive("shop");
                        setShopOpen(false);
                      }}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {cat}
                    </NavLink>
                  ))}
                </div>
              )}
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

        {/* Right side - Desktop */}
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

          <NavLink to="/cart" className="relative">
            <HiOutlineShoppingCart
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

        {/* Mobile icons - Search + Cart */}
        <div className="flex md:hidden items-center gap-4 ml-auto z-20">
          <NavLink to="/cart" className="relative">
            <HiOutlineShoppingCart size={20} />
            {cartItems && cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </NavLink>
          <FiSearch
            size={24}
            className="cursor-pointer"
            onClick={() => setSearchOpen(true)}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full justify-between p-6">
          <ul className="flex flex-col font-medium text-lg space-y-3">
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

            {/* Mobile SHOP Dropdown */}
            <li>
              <button
                onClick={() => setShopOpen((prev) => !prev)}
                className="flex items-center justify-between px-3 text-left py-2"
              >
                <span>Shop</span>
                <FiChevronDown
                  className={`transition-transform ${
                    shopOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {shopOpen && (
                <div className="text-left px-5 flex flex-col space-y-3">
                  {["Dress", "Tops", "Bottoms", "Shirts"].map((cat) => (
                    <NavLink
                      key={cat}
                      to={`/shop?category=${cat}`}
                      onClick={() => {
                        setIsOpen(false);
                        setShopOpen(false);
                      }}
                      className="block text-sm"
                    >
                      {cat}
                    </NavLink>
                  ))}
                </div>
              )}
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

            {/* Mobile Auth */}
            <li>
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-red-500 hover:underline text-left absolute bottom-10 transition"
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
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 flex items-start p-4">
          <div className="flex w-full items-center gap-2">
            <FiX
              size={20}
              className="cursor-pointer"
              onClick={() => setSearchOpen(false)}
            />
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
