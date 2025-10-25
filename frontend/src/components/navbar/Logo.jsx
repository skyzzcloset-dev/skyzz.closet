import React from "react";

const Logo = ({className , text }) => {
  return (
    <div>
      <a href="/" className= {`flex items-center space-x-3 ${className}`}>
        <img src="/Logo.jpg" className={`h-12 rounded-full ${className}`} alt="Logo" />
        <span
          onClick={() => navigate("/")}
          className={`self-center text-lg lg:text-xl font-semibold whitespace-nowrap ${text}`}
        >
          Skyzz.closet
        </span>
      </a>
    </div>
  );
};

export default Logo;
