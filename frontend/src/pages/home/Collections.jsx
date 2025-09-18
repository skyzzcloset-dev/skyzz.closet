
import { lazy } from 'react';

import ScrollAnimate from "../../ui/ScrollAnimate";
import Carousel from '../../ui/Carousel';


const Collections = () => {
  
  return (
    <div className="min-h-screen px-4 lg:px-12">
      <ScrollAnimate direction="up" duration={0.6}>
        <h2 className="text-center font-bold py-12 text-2xl lg:text-4xl">
          Featured Collections
        </h2>
      </ScrollAnimate>

      <ScrollAnimate direction="up" duration={0.6} delay={0.1}>
        <Carousel/>
      </ScrollAnimate>
    </div>
  );
};

export default Collections;


