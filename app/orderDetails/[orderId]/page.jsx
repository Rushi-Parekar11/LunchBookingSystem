"use client"
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
const Page = () => {
  const { orderId } = useParams();
  // console.log(orderId);  // Get orderId from URL params
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orderDetailsPage?orderId=${orderId}`);
        const data = await response.json();
        // console.log(data)
        if (response.ok) {
          setOrder(data);
        } else {
          console.error('Order not found:', data.message);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const handleNavigation = ()=>{
    router.push(`/booking/${order.customerId}`)
  }

  if (loading) return <p className="text-center mt-5">Loading ...</p>;
  if (!order) return <p className="text-center mt-5">No order found.</p>;

  return (
    <>
    <Navbar/>
    <div className="md:max-w-4xl mx-2 md:mx-auto p-4 md:p-6 bg-white shadow-2xl rounded-lg mt-10 border-t-4 border-orange-600">
      
      <ArrowLeft size={30} onClick={handleNavigation} className=' cursor-pointer rounded-full hover:scale-125 duration-100'/>
      <h1 className="text-4xl md:text-5xl font-bold mb-4 my-10">Order Details</h1>

      <div className="mb-4">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Vendor's Name:</strong> {order.vendor}</p>
        <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
        <p><strong>Order Date:</strong> {order.orderDate.dayName}, {order.orderDate.date} {order.orderDate.month} {order.orderDate.year}</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Items :-</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {order.items.map((item) => (
          <div key={item._id} className="flex items-center space-x-4 p-4 border rounded-lg shadow-sm">
            <img
              src={item.menuItem.imageUrl}
              alt={item.menuItem.itemName}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-lg font-medium">{item.menuItem.itemName}</h3>
              <p className="text-sm text-gray-500">{item.menuItem.description}</p>
              <p className="font-semibold">₹{item.menuItem.price}</p>
              <p>Quantity: <span className='font-bold'>{item.quantity}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Page;
