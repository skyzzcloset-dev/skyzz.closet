import React, { useState } from "react";

const LazyImage = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      className={`${className} transition duration-700 ease ${
        loaded ? "blur-0" : "blur-sm"
      }`}
    />
  );
};

export default LazyImage;
