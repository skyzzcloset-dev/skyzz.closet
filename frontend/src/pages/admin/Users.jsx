import React, {useEffect, useState} from "react";
import Table from "../../ui/Tables";

import axios from "axios";

const Users = () => {
  const {user, setUser} = useState([]);
  const [newData, setNewData] = useState([]);

  const columns = ["Name", "Email", "Role"];
  const data = newData.map((u) => ({
    name: u.name,
    email: u.email,
    role: u.role || "User",
  }));

  useEffect(() => {
    const fetchAllUser = async () => {
      const res = await axios.get(
        "http://auth-production-547e.up.railway.app/api/auth/getAllUsers"
      );
      const users = res.data;

      console.log(users);
    };

    fetchAllUser()
  }, []);

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
