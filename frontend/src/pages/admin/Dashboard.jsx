import { useSelector } from "react-redux";
import Sidebar from "../../components/Sidebar";

const Dashboard = () => {
  const stats = [
    {name: "Total Product", value: 120},
    {name: "Total Users", value: 85},
    {name: "Total Orders", value: 45},
  ];

  const orders = [
    {
      id: "#12345",
      customer: "Sophia Clark",
      date: "2024-07-26",
      total: "$150.00",
    },
    {
      id: "#12346",
      customer: "Olivia Bennett",
      date: "2024-07-25",
      total: "$200.00",
    },
    {
      id: "#12347",
      customer: "Emma Carter",
      date: "2024-07-24",
      total: "$100.00",
    },
    {
      id: "#12348",
      customer: "Ava Mitchell",
      date: "2024-07-23",
      total: "$180.00",
    },
    {
      id: "#12349",
      customer: "Isabella Turner",
      date: "2024-07-22",
      total: "$120.00",
    },
  ];

  return (
    <div className="px-5 lg:mr-65">
      <header className="mb-4  border-b border-gray-300 p-5">
        <h1 className="text-2xl lg:text-4xl font-bold">Dashboard</h1>
      </header>
      <main className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5  ">
          {stats.map((item, index) => (
            <div
              key={index}
              className="rounded bg-gray-300 p-5 h-32 flex flex-col justify-center items-center text-center shadow"
            >
              <h1 className="font-semibold">{item.name}</h1>
              <h1 className="text-2xl font-bold">{item.value}</h1>
            </div>
          ))}
        </div>
        <br />
        <div>
          <h1>Recent Orders</h1>
          <div className="overflow-x-auto my-5 rounded">
            <table className="min-w-full border border-gray-200 text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{order.id}</td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4">{order.date}</td>
                    <td className="px-6 py-4 font-semibold">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
