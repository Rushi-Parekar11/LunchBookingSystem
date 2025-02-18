import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Orders from "@/models/orders";



export async function DELETE(req, { params }) {
  const { orderId } = params;

  if (!orderId) {
    return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
  }

  try {
    await connectMongoDB();  // Connect to the database

    const deletedOrder = await Orders.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order cancelled successfully", order: deletedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cancel Order Error:", error);
    return NextResponse.json(
      { message: "Failed to cancel order", error: error.message },
      { status: 500 }
    );
  }
}
