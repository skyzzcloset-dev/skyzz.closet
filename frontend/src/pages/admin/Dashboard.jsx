import {useState, useEffect} from "react";
import axios from "axios";
import Orders from "./Orders";

const Dashboard = () => {
  const [product, setProduct] = useState(0);
  const [user, setUser] = useState(0);
  const [order, setOrder] = useState(0);

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://order-pvnb.onrender.com/api/order/orderCount"
        );
        setOrder(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  console.log(order);

  const stats = [
    {name: "Total Product", value: product},
    {name: "Total Users", value: user},
    {name: "Total Orders", value: order},
  ];

  const columns = ["ID", "Customer", "Date", "Total"];

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
        </main>
      </div>
      <div>
        <Orders />
      </div>
    </>
  );
};

export default Dashboard;
