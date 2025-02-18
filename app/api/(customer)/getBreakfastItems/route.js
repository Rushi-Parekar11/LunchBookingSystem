import { connectMongoDB } from '@/lib/mongodb';
import Snacks from '@/models/snacks';
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();

  try {
    const breakfastItems = await Snacks.find({ category: "BreakFast" }).lean();

    if (!breakfastItems.length) {
      return NextResponse.json({ message: "No breakfast items found" }, { status: 404 });
    }

    return NextResponse.json(breakfastItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching breakfast menu:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
