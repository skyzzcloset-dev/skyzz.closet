import React from "react";
import Logo from "./Logo";
import {useNavigate} from "react-router-dom";

const Back = () => {
  const navigate = useNavigate();
  return (
    <>
      <nav className="bg-white text-black border-b border-gray-200 shadow-sm py-4 ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto ">
          <div className="flex  w-full justify-between items-center px-5">
            <div
              onClick={() => navigate(-1)}
              className=" flex gap-2  cursor-pointer"
            >
              <i className="ri-arrow-left-line"> </i> <label>Back</label>
            </div>
            <div>
              <Logo />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Back;
