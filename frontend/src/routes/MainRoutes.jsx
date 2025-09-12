import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Login, Register } from "../pages";

const MainRoutes = () => {
  return (
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    
  );
};

export default MainRoutes;
