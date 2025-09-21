import React from "react";
import {Navbar} from "../../components/index";
import HeroSection from "./HeroSection";
import Collections from "./Collections";
import NewDrop from "./NewDrop";

const Home = () => {
  return (
    <div className="relative">
      <HeroSection />

      <Collections />

      <NewDrop/>
    </div>
  );
};

export default Home;
