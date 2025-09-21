import React from "react";
import {Outlet} from "react-router-dom";
import Sidebar from "../components/Sidebar";



const AdminLayout = () => {
  return (
    <div >
      <Outlet />
      <div >
      <Sidebar />
      </div>
    </div>
  );
};

export default AdminLayout;
