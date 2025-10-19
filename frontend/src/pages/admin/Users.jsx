import React, {useEffect, useState} from "react";
import Table from "../../ui/Tables";

import axios from "axios";

const Users = () => {
  const [user, setUser] = useState([]);

  const columns = ["Name", "Email", "Role"];
  const data = user.map((u) => ({
    name: `${u.fullName?.firstName ?? ""} ${u.fullName?.lastName ?? ""}`,
    email: u.email,
    role: u.role || "User",
  }));

  async function fetchUser() {
    try {
      const res = await axios.get(
        "https://auth-production-547e.up.railway.app/api/auth/getAllUsers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser(res.data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="px-5">
      <header className="mb-4 border-b border-gray-300 p-5  px-5 lg:mr-65">
        <h1 className="text-2xl lg:text-4xl font-bold">Users</h1>
      </header>

      <main>
        <Table columns={columns} data={data} />
      </main>
    </div>
  );
};

export default Users;
