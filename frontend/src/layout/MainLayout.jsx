import React from "react";
import {Outlet} from "react-router-dom";
import { Navbar } from "../components";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <>
      <div className="absolute top-0 left-0 w-full z-20">
        <Navbar />
      </div>
      <Outlet />

      <Footer/>
    </>
  );
};

export default MainLayout;
