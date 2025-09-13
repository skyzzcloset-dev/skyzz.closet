import React from "react";
import { Navbar } from "../../components/index";
import HeroSection from "./HeroSection";
import Collections from "./Collections";

const Home = () => {
  return (
    <div className="relative">
      {/* Navbar overlay */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Navbar />
      </div>

      {/* Hero section below it */}
      <HeroSection />

      <Collections/>
    </div>
  );
};

export default Home;
