import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-20">
        <Navbar />
      </div>

      <main className="pt-16">
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default MainLayout;
