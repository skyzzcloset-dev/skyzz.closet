import React from "react";
import {Navbar} from "../../components/index";
import HeroSection from "./HeroSection";
import Collections from "./Collections";

const Home = () => {
  return (
    <div className="relative">
      <HeroSection />

      <Collections />
    </div>
  );
};

export default Home;
