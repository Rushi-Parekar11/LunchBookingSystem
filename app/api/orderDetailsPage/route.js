import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../lib/mongodb';
import Orders from '../../../models/orders';
import User from '../../../models/user';
import Menu from '../../../models/menu';
import Vendor from '../../../models/vendor';

export async function GET(req) {
  const orderId = req.nextUrl.searchParams.get('orderId');  // Get from query string

  if (!orderId) {
    return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
  }

  try {
    await connectMongoDB();
    console.log("DB Connected");

    const order = await Orders.findById(orderId)
      .populate({ path: 'customer', model: User, select: 'name _id' })  // Select customer ID and name
      .populate({ path: 'vendor', model: Vendor, select: 'shopName' })
      .populate({ path: 'items.menuItem', model: 'Menu' });
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const response = {
      _id: order._id,
      customerName:order.customer.name,
      customerId: order.customer._id,
      vendor: order.vendor.shopName,
      items: order.items,
      status:order.status,
      totalAmount: order.totalAmount,
      orderDate: order.orderDate,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}