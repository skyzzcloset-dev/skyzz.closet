import React, { useEffect, useState } from "react";
import Table from "../../ui/Tables";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);


  const columns = ["Name", "Email", "Role"];
  const data = users.map((u) => ({
    name: u.name,
    email: u.email,
    role: u.role || "User",
  }));

  return (
    <div className="p-5">
      <header className="mb-4 border-b border-gray-300 p-5">
        <h1 className="text-2xl lg:text-4xl font-bold">Users</h1>
      </header>

      <main>
        <Table
          columns={columns}
          data={data}
          onUpdate={(row) => console.log("Update user:", row)}
          onDelete={(row) => console.log("Delete user:", row)}
        />
      </main>
    </div>
  );
};

export default Users;
