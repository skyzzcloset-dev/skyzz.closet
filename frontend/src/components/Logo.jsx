import React from "react";

const Logo = () => {
  return (
    <div>
      <a href="/" className="flex items-center space-x-3">
        <img src="/Logo.jpg" className="h-12 rounded-full" alt="Logo" />
        <span
          onClick={() => navigate("/")}
          className="self-center text-2xl font-semibold whitespace-nowrap"
        >
          Skyzz.closet
        </span>
      </a>
    </div>
  );
};

export default Logo;
