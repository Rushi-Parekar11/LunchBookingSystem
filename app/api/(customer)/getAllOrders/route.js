import Orders from "@/models/orders";
import Snack from "../../../../models/snacks"
import Menu from "../../../../models/menu"
import { connectMongoDB } from "@/lib/mongodb";


export async function GET(req) {
  const customerId = req.nextUrl.searchParams.get("customerId");

  await connectMongoDB();

  try {
    const orders = await Orders.find({ customer: customerId }).populate("items.itemId")

    const groupedOrders = orders.reduce((acc, order) => {
      const { date, dayName, month, year } = order.orderDate;
      const dateKey = `${date} ${dayName}, ${month} ${year}`;

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(order);
      return acc;
    }, {});

    return new Response(JSON.stringify(groupedOrders), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
