"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";
import * as XLSX from "xlsx";
import VendorNavbar from "@/components/VendorNavbar";

export default function VendorDashboard() {

  const getTodayIST = () => {
    const today = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; 
    const istDate = new Date(today.getTime() + istOffset);
    return istDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD
  };

  const { vendorId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getTodayIST());
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem("vendorSession");

    if (session) {
      const { sessionId } = JSON.parse(session);

      if (sessionId !== vendorId) {
        localStorage.removeItem("vendorSession");
        toast.error("Invalid Vendor-ID. Try logging in again.");
        router.push("/onboardingvendor/login");
        return;
      }
    } else {
      toast.error("Try logging in again.");
      router.push("/onboardingvendor/login");
      return;
    }

    if (vendorId) {
      // fetchOrders();
    }
  }, [vendorId, selectedDate]);


  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const getMonthName = (monthIndex) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[monthIndex];
  };

  async function fetchOrders() {
    try {
      const selected = new Date(selectedDate);
      const year = selected.getUTCFullYear();
      const month = getMonthName(selected.getUTCMonth());
      const day = String(selected.getUTCDate()).padStart(2, "0");

      const res = await fetch(
        `/api/orderDetailsVendor?vendorId=${vendorId}&day=${day}&month=${month}&year=${year}`
      );
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      } else {
        setOrders([]);
        toast.dismiss()
        toast.error("No orders for selected date");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  const convertToISTTime = (isoDate) => {
    const options = {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    const timeString = new Date(isoDate).toLocaleTimeString("en-IN", options);
    return timeString.replace(/(am|pm)/i, (match) => match.toUpperCase());
  };

  // const exportToExcel = () => {
  //   if (orders.length === 0) {
  //     toast.error("No orders to export");
  //     return;
  //   }

  //   const formattedData = orders.map((order) => {
  //     return {
  //       "Order ID": order._id,
  //       "Customer Name": `${order.customer.firstName} ${order.customer.lastName}`,
  //       "Employee ID": order.customer.empId,
  //       "Item Ordered": order.items
  //         .map((item) => item.menuItem.itemName)
  //         .join(", "),
  //       Quantity: order.items.map((item) => item.quantity).join(", "),
  //       "Price (₹)": order.items.map((item) => item.price).join(", "),
  //       "Total Amount (₹)": order.totalAmount,
  //       "Order Date": `${order.orderDate.date} ${order.orderDate.dayName} ${order.orderDate.year}`,
  //       "Order Time": convertToISTTime(order.createdAt),
  //     };
  //   });

  //   const worksheet = XLSX.utils.json_to_sheet(formattedData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

  //   // Name the file with the selected date
  //   const fileName = `Orders_${selectedDate}.xlsx`;
  //   XLSX.writeFile(workbook, fileName);
  // };

  const exportToExcel = () => {
    if (orders.length === 0) {
      toast.error("No orders to export");
      return;
    }
  
    const formattedData = orders.map((order) => {
      const itemQuantities = order.items.reduce((acc, item) => {
        const itemName = item.menuItem.itemName;
        acc[itemName] = item.quantity;
        return acc;
      }, {});
  
      return {
        "Order ID": order._id,
        "Customer Name": `${order.customer.firstName} ${order.customer.lastName}`,
        "Veg-Thali": itemQuantities["Veg-Thali"] || 0,
        "Non-Veg-Thali": itemQuantities["Non-Veg-Thali"] || 0,
        "Total Amount (₹)": order.totalAmount,
        "Order Time": convertToISTTime(order.createdAt),
      };
    });
  
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
  
    const fileName = `Orders_${selectedDate}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const calculateTotalQuantitiesAndAmount = () => {
    const totalQuantities = {
      "Veg-Thali": 0,
      "Non-Veg-Thali": 0
    };
    let totalAmount = 0;

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const itemName = item.menuItem.itemName;
        totalQuantities[itemName] = (totalQuantities[itemName] || 0) + item.quantity;
      });
      totalAmount += order.totalAmount;
    });

    return { totalQuantities, totalAmount };
  };

  const { totalQuantities, totalAmount } = calculateTotalQuantitiesAndAmount();


  return (
    <div className="container ">
      <VendorNavbar/>
      <h1 className="text-5xl font-bold my-10 items-center flex justify-center">
        Orders
      </h1>
  
      <div className="flex justify-center mb-8">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="border p-2 rounded-lg w-72"
        />
      </div>
      {orders.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={exportToExcel}
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-white hover:text-green-500 border-2 border-green-500 duration-100"
          >
            Download Excel
          </button>
        </div>
      )}
  
      {loading ? (
        <div className="flex justify-center mt-48 ">
          <SyncLoader color="#ff9e00" size={20} speedMultiplier={1} />
        </div>
      ) : orders.length > 0 ? (
        <div className="overflow-x-auto mt-5 mx-auto p-6">
          <h1 className="my-5 font-bold text-2xl text-center">
            Orders of date: <span className="underline">{orders[0].orderDate.date} {orders[0].orderDate.month} {orders[0].orderDate.year}</span>
          </h1>

    <div className="mb-5">
  <h2 className="text-xl font-semibold flex justify-center underline">
    Summary :
  </h2>
  <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
    <thead>
      <tr className="bg-gray-100">
        <th className="border border-gray-300 px-4 py-2">Veg Thali</th>
        <th className="border border-gray-300 px-4 py-2">Non-Veg Thali</th>
        <th className="border border-gray-300 px-4 py-2">Total Amount (₹)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border border-gray-300 px-4 py-2">{totalQuantities["Veg-Thali"]}</td>
        <td className="border border-gray-300 px-4 py-2">{totalQuantities["Non-Veg-Thali"]}</td>
        <td className="border border-gray-300 px-4 py-2">{totalAmount}</td>
      </tr>
    </tbody>
  </table>
</div>


<h2 className="text-xl font-semibold flex justify-center my-5 underline">
     Order details :
  </h2>


          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Order ID</th>
                <th className="py-2 px-4 border">Customer Name</th>
                <th className="py-2 px-4 border">Veg-Thali</th>
                <th className="py-2 px-4 border">Non-Veg-Thali</th>
                <th className="py-2 px-4 border">Total Amount</th>
                <th className="py-2 px-4 border">Order Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const itemQuantities = order.items.reduce((acc, item) => {
                  const itemName = item.menuItem.itemName;
                  acc[itemName] = item.quantity;
                  return acc;
                }, {});
  
                return (
                  <tr key={order._id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border">{order._id}</td>
                    {/* <td className="py-2 px-4 border">{order.customer.firstName} {order.customer.lastName}</td> */}
                    <td className="py-2 px-4 border">{itemQuantities["Veg-Thali"] || 0}</td>
                    <td className="py-2 px-4 border">{itemQuantities["Non-Veg-Thali"] || 0}</td>
                    <td className="py-2 px-4 border">₹{order.totalAmount}</td>
                    <td className="py-2 px-4 border">{order.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="items-center flex justify-center text-xl my-16">No orders found for selected date.</p>
      )}
    </div>
  );
}
