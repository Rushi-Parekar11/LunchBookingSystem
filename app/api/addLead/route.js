import { NextResponse } from "next/server";
import Lead from "@/models/lead";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json(
        { message: "customerId is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const existingLead = await Lead.findOne({customerId}).populate("customerId");

    if (existingLead) {
      return NextResponse.json(
        { message: "Lead already exists for this user and ad", lead: existingLead },
        { status: 200 }
      );
    }

    const newLead = new Lead({
      customerId
    });

    const savedLead = await newLead.save();

    const populatedLead = await savedLead.populate({
      path: "customerId",
      select: "firstName lastName email", 
    });

    return NextResponse.json(
      { message: "Lead recorded successfully", lead: populatedLead },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error tracking lead:", error);
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500 }
    );
  }
}
