import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../lib/mongodb';
import Orders from '../../../models/orders';
import User from '../../../models/user';
import Menu from '../../../models/menu';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    const day = searchParams.get("day");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    // Validate required parameters
    if (!customerId || !day || !month || !year) {
      return NextResponse.json({ message: 'Missing required query parameters' }, { status: 400 });
    }

    await connectMongoDB();

    const userOrder = await Orders.find({
      "orderDate.date": parseInt(day),
      "orderDate.month": month,
      "orderDate.year": parseInt(year),
      customer: customerId
    })
      .populate({
        path: "customer",
        model: User,
        select: "firstName lastName empId"
      })
      .populate({
        path: "items.menuItem",
        model: Menu,
        select: "itemName"
      })
      .lean();

    // If no orders are found
    if (!userOrder || userOrder.length === 0) {
      return NextResponse.json({ message: 'No orders found for this customer on the specified date' }, { status: 404 });
    }

    // Return the response with the orders
    return NextResponse.json({ userOrder }, { status: 200 });

  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

