"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const VerifyOrderPage = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false); // Track order status
  const router = useRouter();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orderDetailsPage?orderId=${orderId}`);
        const data = await response.json();
        if (response.ok) {
          setOrder(data);
          // Check if the order status is already 'Received'
          if (data.status === "Received") {
            setIsVerified(true);
          }
        } else {
          console.error("Order not found:", data.message);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const handleVerify = async () => {
    try {
      const response = await fetch(`/api/updateorderstatus/${orderId}`, {
        method: "PATCH",
      });
      if (response.ok) {
        toast.dismiss();
        toast.success("Order status updated to Received");
        setIsVerified(true); // Update the status to show confirmation card
      } else {
        const data = await response.json();
        toast.dismiss();
        toast.error(`Error updating order status: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading ...</p>;
  if (!order) return <p className="text-center mt-5">No order found.</p>;

  return (
    <>
      <div className="md:max-w-4xl mx-2 md:mx-auto p-4 md:p-6 bg-white shadow-2xl rounded-lg border-t-4 border-orange-600 mt-16 md:mt-36">
        {isVerified ? (
          <div className="text-center p-6 bg-green-100 border border-green-500 rounded-lg">
            <h2 className="text-xl font-bold text-green-700">
              Order status updated successfully!
            </h2>
            <p className="mt-2 text-gray-700">
              The order has been marked as <strong>Received</strong>.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-4xl md:text-4xl font-bold mb-4 my-5">
              Order Details
            </h1>

            <div className="mb-4">
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Vendor's Name:</strong> {order.vendor}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{order.totalAmount}
              </p>
              <p>
                <strong>Order Date:</strong> {order.orderDate.dayName},{" "}
                {order.orderDate.date} {order.orderDate.month}{" "}
                {order.orderDate.year}
              </p>
            </div>

            <h2 className="text-xl font-semibold mb-2">Items :-</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center space-x-4 p-4 border rounded-lg shadow-sm"
                >
                  <img
                    src={item.menuItem.imageUrl}
                    alt={item.menuItem.itemName}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-medium">{item.menuItem.itemName}</h3>
                    <p className="text-sm text-gray-500">
                      {item.menuItem.description}
                    </p>
                    <p className="font-semibold">₹{item.menuItem.price}</p>
                    <p>
                      Quantity: <span className="font-bold">{item.quantity}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleVerify}
              className="mt-6 px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-500"
            >
              Verify
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default VerifyOrderPage;
