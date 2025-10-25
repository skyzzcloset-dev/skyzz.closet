import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import Orders from "./Orders";

const Dashboard = () => {
  const fetchProductCount = async () => {
    const res = await axios.get(
      "https://product-production-4bd9.up.railway.app/api/product/count"
    );
    return res.data.count || 0;
  };

  const fetchUserCount = async () => {
    const res = await axios.get(
      "https://auth-production-547e.up.railway.app/api/auth/userCount",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res.data.count || 0;
  };

  const fetchOrderCount = async () => {
    const res = await axios.get(
      "https://order-pvnb.onrender.com/api/order/orderCount",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return res.data.count || 0;
  };

  const {data: product = 0} = useQuery({
    queryKey: ["productCount"],
    queryFn: fetchProductCount,
  });

  const {data: user = 0} = useQuery({
    queryKey: ["userCount"],
    queryFn: fetchUserCount,
  });

  const {data: order = 0} = useQuery({
    queryKey: ["orderCount"],
    queryFn: fetchOrderCount,
  });



  const stats = [
    {name: "Total Product", value: product},
    {name: "Total Users", value: user},
    {name: "Total Orders", value: order},
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
        </main>
      </div>
      <div>
        <Orders />
      </div>
    </>
  );
};

export default Dashboard;
