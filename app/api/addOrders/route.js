
import Orders from "../../../models/orders";
import { connectMongoDB } from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectMongoDB();

    try {
        const { customer, vendor, items, totalAmount, orderDate } = await req.json(); 

        if (!customer || !vendor || !items.length || !totalAmount || !orderDate) {
            return NextResponse.json({ success: false, message: "Invalid order data" }, { status: 400 });
        }

        const newOrder = new Orders({
            customer,
            vendor,
            items,
            totalAmount,
            orderDate
        });
        // console.log(newOrder);

        const savedOrder = await newOrder.save();

        return NextResponse.json({ success: true, order: savedOrder }, { status: 201 });
    } catch (error) {
        console.error("Order creation failed:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
