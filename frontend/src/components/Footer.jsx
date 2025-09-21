import React, {useState} from "react";
import Logo from "./Logo";
import {NavLink} from "react-router-dom";

const Footer = () => {
  const [active, setActive] = useState("");

  const linkClasses = (name) =>
    `block py-2 px-3 rounded transition-colors duration-300 ${
      active === name
        ? "text-blue-700 font-semibold"
        : "text-black hover:text-blue-700"
    }`;

  return (
    <footer className="bg-gray-200  py-10">
      <div className="max-w-5xl mx-auto ">
        <div className="grid-cols-1 grid lg:flex lg:justify-between sm:grid-cols-2 lg:grid-cols-3 text-center  lg:text-left">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center lg:items-start mb-10">
            <Logo className="h-20 w-auto mb-1" text="text-2xl" />
            <p className="text-gray-600 text-sm ">
             Because Ordinary Was Never Your Thing.
            </p>
          </div>

          {/* Quick Links */}

          <div className="flex justify-center gap-10 lg:grid lg:grid-cols-2 ">
             <div className="flex flex-col items-center lg:items-start">
            <h2 className="font-semibold text-xl mb-3">Quick Links</h2>
            <ul className="space-y-1">
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

          {/* Company */}
          <div className="flex flex-col items-center lg:items-start">
            <h2 className="font-semibold text-xl mb-3">Company</h2>
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/contact"
                  onClick={() => setActive("contactus")}
                  className={linkClasses("contactus")}
                >
                  Contact Us
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/shipping-policy"
                  onClick={() => setActive("shipping")}
                  className={linkClasses("shipping")}
                >
                  Shipping Policy
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/refund-policy"
                  onClick={() => setActive("refund")}
                  className={linkClasses("refund")}
                >
                  Refund Policy
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/terms-of-service"
                  onClick={() => setActive("terms")}
                  className={linkClasses("terms")}
                >
                  Terms of Service
                </NavLink>
              </li>
            </ul>
          </div>
      
          </div> 
         
        </div>
        {/* Footer Bottom */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Skyzz.closet. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
