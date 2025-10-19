import {lazy} from "react";

import ScrollAnimate from "../../ui/ScrollAnimate";
import Carousel from "../../ui/Carousel";

const Collections = () => {
  const products = [
    {id: 1, name: "Dress", img: "/dress.png", link: "/shop?category=Dress"},
    {id: 2, name: "Tops", img: "/tops.png", link: "/shop?category=Tops"},
    {id: 3, name: "Bottoms", img: "/bottoms.png", link: "/shop?category=Bottoms"},
    {id: 4, name: "Shirts", img: "/shirts.png", link: "/shop?category=Shirts"},
   
  ];
  return (
    <div className=" ">
      <ScrollAnimate direction="up" duration={0.6}>
        <h2 className="text-center font-bold py-10 text-2xl lg:text-4xl">
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
