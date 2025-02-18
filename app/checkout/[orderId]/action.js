export const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`/api/orderDetailsPage?orderId=${orderId}`);
      const data = await response.json();
      // console.log(data)
      if (response.ok) {
        return data;
      } else {
        return console.error("Order not found:", data.message);
      }
    } catch (error) {
      return console.error("Error fetching order:", error);
    } 
  };