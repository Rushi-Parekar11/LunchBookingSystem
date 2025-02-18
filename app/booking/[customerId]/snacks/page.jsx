"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import MenuCard from "@/components/MenuCard";
import { useParams, useRouter } from "next/navigation";
import LoadingGif from "../../../../assets/LoadingComponentImage.gif";
import Image from "next/image";

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

const getDayName = (dayIndex) => {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thrusday",
    "Friday",
    "Saturday",
    "August",
  ];
  return dayNames[dayIndex];
};

const BreakfastMenu = () => {
  const { customerId } = useParams();

  const [breakfastItems, setBreakfastItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const customer = JSON.parse(localStorage.getItem("customer"));
    const localCustomerId = customer?.customerId;

    if (!customer || !localCustomerId || localCustomerId !== customerId) {
      toast.dismiss();
      toast.error("Unauthorized access. Redirecting to login page...");
      router.push("/onboardingcustomer/login");
    }
  }, [customerId]);

  useEffect(() => {
    fetchBreakfastMenu();
  }, []);

  const fetchBreakfastMenu = async () => {
    try {
      const response = await fetch("/api/getSnackItems");

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setBreakfastItems(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load breakfast menu!");
    } finally {
      setLoading(false);
    }
  };

  const onOrder = (item, quantity) => {
    const existingItem = orderItems.find(
      (orderItem) => orderItem.itemId === item._id
    );

    if (existingItem) {
      setOrderItems(
        orderItems.map((orderItem) =>
          orderItem.itemId === item._id
            ? { ...orderItem, quantity: orderItem.quantity + quantity }
            : orderItem
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          itemId: item._id,
          itemName: item.itemName,
          quantity,
          price: item.price,
          category: "AllDaySnacks",
        },
      ]);
    }
    toast.dismiss();
    toast.success(`Added ${item.itemName} to your order!`);
  };

  const onRemove = (item) => {
    setOrderItems((prev) => {
      return prev
        .map((order) =>
          order.itemId === item._id
            ? { ...order, quantity: order.quantity - 1 }
            : order
        )
        .filter((order) => order.quantity > 0); // Remove if quantity reaches 0
    });

    toast.dismiss();
    toast.error(`Removed ${item.itemName}`);
  };

  // const updateQuantity = (item, quantity) => {
  //   setOrderItems(
  //     orderItems.map((orderItem) =>
  //       orderItem.itemId === item._id
  //         ? { ...orderItem, quantity: Math.max(1, orderItem.quantity + quantity) }
  //         : orderItem
  //     )
  //   );
  // };

  const submitOrder = async () => {
    const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const d = new Date();
    const dayName = getDayName(d.getDay());
    const month = getMonthName(d.getMonth());
    // console.log(orderItems)
    const vendorId = breakfastItems[0].vendor;

    const orderData = {
      customer: customerId,
      vendor: vendorId,
      items: orderItems.map((item) => ({
        itemId: item.itemId,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
        itemType: "Snack", // Added itemType as 'snack'
      })),
      totalAmount,
      orderDate: {
        date: d.getDate(),
        dayName: dayName,
        month: month,
        year: d.getFullYear(),
      },
    };
    // console.log(orderData)
    try {
      const response = await fetch("/api/addOrders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit order: ${response.status}`);
      }

      const data = await response.json();
      toast.success("Order placed successfully!");
      router.push(`/myOrders/${customerId}`);
      setOrderItems([]);
    } catch (err) {
      toast.dismiss();
      toast.error(err.message);
    }
  };

  // 🔹 Calculate item quantities for displaying in the cart
  const itemQuantities = orderItems.reduce((acc, item) => {
    acc[item.itemName] = (acc[item.itemName] || 0) + item.quantity;
    return acc;
  }, {});

  // 🔹 Calculate total price
  const calculateTotalPrice = () => {
    return orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  };

  // 🔹 Handle clear cart action
  const handleClearOrder = () => {
    setOrderItems([]);
    toast.success("Cart cleared!");
  };

  // 🔹 Handle order submission
  const handleOrder = () => {
    submitOrder();
  };

  if (loading)
    return (
      <div className="min-h-screen text-center text-lg font-semibold">
        <Image
          src={LoadingGif}
          className="md:ml-[35%] mt-[55%] md:mt-[15%]"
          alt="loader"
        />
      </div>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="md:h-screen">
      <Navbar />
      <h2 className="text-3xl font-bold text-center my-6">Snacks Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 mx-10 md:mx-20">
        {breakfastItems.map((item) => (
          <MenuCard
            key={item._id}
            item={item}
            onOrder={onOrder}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* Order Details */}
      {orderItems.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 z-50 bg-opacity-95">
          <div className="flex justify-between items-center text-center">
            <div className="md:flex md:flex-wrap w-3/4 md:w-1/2">
              {Object.entries(itemQuantities).map(([itemName, quantity]) => (
                <span
                  key={itemName}
                  className="text-[13px] bg-black text-white px-2 py-1 rounded-lg mx-[2px] cursor-pointer hover:bg-gray-800 mb-1"
                >
                  {itemName}: {quantity}
                </span>
              ))}
            </div>
            <div className="md:flex justify-evenly">
              <p className="text-[16px] md:text-2xl font-bold md:mx-2 md:px-5 py-3">
                Total Amount: ₹{calculateTotalPrice()}
              </p>
              <div className="flex md:block">
                <button
                  onClick={handleClearOrder}
                  className="md:h-[50px] px-3 md:px-5 py-1 md:py-3 mb-3 text-white rounded-lg font-bold border-2 border-red-500 bg-red-500 hover:bg-white hover:text-red-500"
                  disabled={loading}
                >
                  Clear
                </button>
                <button
                  onClick={handleOrder}
                  className={`md:h-[50px] mx-2 px-3 md:px-5 py-1 mb-3 md:py-3 rounded-lg font-bold ${
                    loading
                      ? "bg-white border-2 border-blue-500 text-blue-500"
                      : "text-white border-2 border-green-500 bg-green-500 hover:bg-white hover:text-green-500"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakfastMenu;
