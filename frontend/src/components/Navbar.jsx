import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "./index";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [active, setActive] = useState("home");

  const navigate = useNavigate();

  const linkClasses = (name) =>
    `block py-2 px-3 rounded md:p-0 transition ${
      active === name
        ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
        : "text-black hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700"
    }`;

  return (
    <nav className="bg-white text-black border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Logo />

        {/* Right side */}
        <div className="flex md:order-2">
          {/* Search / User / Cart (desktop) */}
          <div className="relative hidden md:flex items-center gap-5">
            <i
              onClick={() => setSearch(!search)}
              className="ri-search-line cursor-pointer"
            ></i>
            <i
              onClick={() => navigate("/login")}
              className="ri-user-line cursor-pointer"
            ></i>
            <i className="ri-shopping-bag-2-line cursor-pointer"></i>
          </div>

          {/* Hamburger menu button (mobile) */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-700 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-search"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
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
          </button>
        </div>

        {/* Links + Search (mobile + desktop toggle) */}
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            isOpen ? "block" : "hidden"
          }`}
          id="navbar-search"
        >
          {/* Mobile Search */}
          <div className="relative mt-3 md:hidden">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="search-navbar-mobile"
              className="block w-full p-2 pl-10 text-sm text-black border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search..."
            />
          </div>

          {/* Desktop Search (when toggled) */}
          {search ? (
            <div className="w-full md:w-auto md:ml-5 flex justify-center items-center gap-4">
              <input
                type="text"
                placeholder="Search..."
                className="block md:w-[150px] p-3 pl-3 text-sm text-black border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              />
              <i
                onClick={() => setSearch(false)}
                className="ri-close-line text-xl cursor-pointer"
              ></i>
            </div>
          ) : (
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-white md:space-x-8 md:flex-row md:mt-0 md:border-0">
              <li>
                <a
                  href="#"
                  onClick={() => setActive("home")}
                  className={linkClasses("home")}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => setActive("shop")}
                  className={linkClasses("shop")}
                >
                  Shop
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => setActive("newdrop")}
                  className={linkClasses("newdrop")}
                >
                  New Drop
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => setActive("contact")}
                  className={linkClasses("contact")}
                >
                  Contact
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
