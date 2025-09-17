import React from "react";
import { motion } from "framer-motion";

/**
 * Universal scroll animation wrapper
 */
const ScrollAnimate = ({
  children,
  direction = "up",
  duration = 0.5,
  delay = 0,
  className = "",
  once = true, // 👈 add prop for re-trigger option
  amount = 0.2, // 👈 add prop for how much should enter viewport before triggering
}) => {
  const initialVariants = {
    up: { opacity: 0, y: 50 },
    down: { opacity: 0, y: -50 },
    left: { opacity: 0, x: 50 },
    right: { opacity: 0, x: -50 },
  };

  return (
    <motion.div
      className={className}
      initial={initialVariants[direction] || initialVariants.up}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimate;
