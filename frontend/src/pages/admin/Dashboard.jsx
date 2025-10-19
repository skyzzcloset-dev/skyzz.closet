import {useState, useEffect} from "react";
import Table from "../../ui/Tables";
import axios from "axios";

const Dashboard = () => {
  const [product, setProduct] = useState(0);
  const [user, setUser] = useState(0);

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const res = await axios.get(
          "https://product-production-4bd9.up.railway.app/api/product/count"
        );
        setProduct(res.data.count || 0);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductCount();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        "https://auth-production-547e.up.railway.app/api/auth/userCount",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser(res.data.count);
    };

    fetchUser();
  }, []);

  const stats = [
    {name: "Total Product", value: product},
    {name: "Total Users", value: user},
    {name: "Total Orders", value: 45},
  ];

  const columns = ["ID", "Customer", "Date", "Total"];
  const orders = [
    {id: "#12345", customer: "Sophia Clark", date: "2024-07-26", total: "$150"},
    {
      id: "#12346",
      customer: "Olivia Bennett",
      date: "2024-07-25",
      total: "$200",
    },
    {id: "#12347", customer: "Emma Carter", date: "2024-07-24", total: "$100"},
  ];

  return (
    <>
      <div className="px-5 lg:mr-65">
        <header className="mb-4 border-b border-gray-300 p-5">
          <h1 className="text-2xl lg:text-4xl font-bold">Dashboard</h1>
        </header>

        <main className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stats.map((item, index) => (
              <div
                key={index}
                className="rounded bg-gray-200 p-5 h-32 flex flex-col justify-center items-center shadow"
              >
                <h1 className="font-semibold">{item.name}</h1>
                <h1 className="text-2xl font-bold">{item.value}</h1>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <h1 className="text-lg font-semibold mb-2">Recent Orders</h1>
          </div>
        </main>
      </div>
      <div className="px-5">
        <Table
          columns={columns}
          data={orders}
          onUpdate={(row) => ("Update order:", row)}
          onDelete={(row) => ("Delete order:", row)}
        />
      </div>
    </>
  );
};

export default Dashboard;
