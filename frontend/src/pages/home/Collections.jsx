
import { lazy } from 'react';

import ScrollAnimate from "../../ui/ScrollAnimate";


const Collections = () => {
  const featuredCollections = [
    { name: "Shirts", img: "/shirts.webp" },
    { name: "Skirts", img: "/skirts.webp" },
    { name: "Tops", img: "/tops.webp" },
    { name: "Bottoms", img: "/bottoms.webp" },
  ];

  return (
    <div className="min-h-screen px-4 lg:px-12">
      <ScrollAnimate direction="up" duration={0.6}>
        <h2 className="text-center font-bold py-12 text-2xl lg:text-4xl">
          Featured Collections
        </h2>
      </ScrollAnimate>

      <ScrollAnimate direction="up" duration={0.6} delay={0.1}>
        
      </ScrollAnimate>
    </div>
  );
};

export default Collections;


