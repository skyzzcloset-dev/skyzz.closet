import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <>
      {/* Navbar stays fixed */}
      <div className="fixed top-0 left-0 w-full z-20">
        <Navbar />
      </div>

      {/* Main content with top padding for navbar */}
      <main className="mt-16">
        <Outlet />
      </main>

      {/* Footer in normal flow */}
      <Footer />
    </>
  );
};

export default MainLayout;
