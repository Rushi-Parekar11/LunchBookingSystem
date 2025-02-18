import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Orders from "@/models/orders";

export async function GET(req) {
  try {
    // Parse query params
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    const date = Number(searchParams.get("date"));
    const dayName = searchParams.get("day");
    const month = searchParams.get("month");
    const year = Number(searchParams.get("year"));
    
    // Validate required parameters
    if (!customerId || !date || !dayName || !month || !year) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    await connectMongoDB(); // Ensure DB connection

    // Query orders, excluding orders with "WeeklyMenu" category
    const orders = await Orders.find({
      "customer": customerId,
      "orderDate.date": date,
      "orderDate.dayName": dayName,
      "orderDate.month": month,
      "orderDate.year": year,
      "items": {
        $not: {
          $elemMatch: { category: "WeeklyMenu" }
        }
      },
      "paymentStatus": "Pending"
    }).populate("customer")
    .populate("vendor")
    .populate("items.itemId")
    

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
