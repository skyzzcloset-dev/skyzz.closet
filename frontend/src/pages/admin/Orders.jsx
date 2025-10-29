import React, {useEffect, useState} from "react";
import axios from "axios";
import Table from "../../ui/Tables";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);

  const reversedOrders = [...orders].reverse();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://skyzzcloset-production-b3c8.up.railway.app/api/order/getAllOrders",
          {
            headers: {Authorization: `Bearer ${token}`},
          }
        );

        setOrders(res.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const formatAddress = (address) => {
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zip,
      address.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  // ✅ Column labels must match the keys in `data` (case-insensitive)
  const columns = ["", "Order ID", "Customer", "Address", "Total", "Actions"];

  // ✅ Map API data into table rows with lowercase keys
  const data = reversedOrders.map((order) => {
    const address = order.shippingAddress || {};
    const isDelivered = selectedOrders.includes(order._id);

    return {
      "": (
        <input
          type="checkbox"
          checked={isDelivered}
          onChange={() => handleCheckboxChange(order._id)}
          className="cursor-pointer"
        />
      ),
      "order id": (
        <span className="font-mono text-gray-800">
          #{order._id.slice(-6).toUpperCase()}
        </span>
      ),
      customer: (
        <span className="text-gray-800">
          {address.firstName} {address.lastName}
        </span>
      ),
      address: formatAddress(address),
      total: (
        <span className="font-semibold">
          {order.totalAmount?.price} {order.totalAmount?.currency}
        </span>
      ),
      actions: (
        <button
          onClick={() => setViewOrder(order)}
          className="text-blue-600 hover:underline font-medium"
        >
          View
        </button>
      ),
    };
  });

  return (
    <>
      <div className="px-5 lg:mr-65">
        <header className="mb-4 border-b border-gray-300 p-5">
          <h1 className="text-2xl lg:text-4xl font-bold">Orders</h1>
        </header>
        {/* ✅ Modal */}
        {viewOrder && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Order ID:</span>{" "}
                  {viewOrder._id}
                </p>
                <p>
                  <span className="font-semibold">Customer:</span>{" "}
                  {viewOrder.shippingAddress?.firstName}{" "}
                  {viewOrder.shippingAddress?.lastName}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {viewOrder.shippingAddress?.phone}
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {formatAddress(viewOrder.shippingAddress)}
                </p>
                <p>
                  <span className="font-semibold">Total:</span>{" "}
                  {viewOrder.totalAmount?.price}{" "}
                  {viewOrder.totalAmount?.currency}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(viewOrder.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setViewOrder(null)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Table columns={columns} data={data} />
    </>
  );
};

export default Orders;
