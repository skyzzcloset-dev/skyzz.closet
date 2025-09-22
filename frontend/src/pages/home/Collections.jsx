import {lazy} from "react";

import ScrollAnimate from "../../ui/ScrollAnimate";
import Carousel from "../../ui/Carousel";

const Collections = () => {
  const products = [
    {id: 1, name: "Dress", img: "/dress.png", link: "/product/1"},
    {id: 2, name: "Tops", img: "/tops.png", link: "/product/2"},
    {id: 3, name: "Bottoms", img: "/bottoms.png", link: "/product/3"},
    {id: 4, name: "Shirts", img: "/shirts.png", link: "/product/3"},
   
  ];
  return (
    <div className="p-10 lg:px-12">
      <ScrollAnimate direction="up" duration={0.6}>
        <h2 className="text-center font-bold py-12 text-2xl lg:text-4xl">
          Featured Collections
        </h2>
      </ScrollAnimate>

      <ScrollAnimate direction="up" duration={0.6} delay={0.1}>
        <Carousel products={products} />
      </ScrollAnimate>
    </div>
  );
};

export default Collections;
