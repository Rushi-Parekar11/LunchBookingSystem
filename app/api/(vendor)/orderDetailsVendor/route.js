import { connectMongoDB } from "../../../../lib/mongodb";
import Orders from "../../../../models/orders";
import User from "../../../../models/user";
import Menu from "../../../../models/menu";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Ensure database connection
    await connectMongoDB();
    
    // Extract vendorId, day, month, and year from the URL
    const { searchParams } = new URL(req.url);
    // console.log(searchParams)
    const vendorId = searchParams.get("vendorId");
    const day = searchParams.get("day");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (!vendorId || !day || !month || !year) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
    }

    // Fetch orders for the selected date and vendor
    const orders = await Orders.find({
      "orderDate.date": parseInt(day),
      "orderDate.month": month,
      "orderDate.year": parseInt(year),
      vendor: vendorId
    })
      .populate({
        path: "customer",
        model: User,
        select: "firstName lastName empId"
      })
      .populate({
        path: "items.itemId",
        model: Menu,
        select: "itemName"
      })
      .lean();


    if (!orders.length) {
      return NextResponse.json({ message: "No orders found for selected date or Invalid Vendor-Id" }, { status: 404 });
    }

    // Return the fetched orders
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
