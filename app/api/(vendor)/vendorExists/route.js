import { connectMongoDB } from "@/lib/mongodb";
import Vendor from "@/models/vendor";
import { NextResponse } from "next/server";



export async function POST(req) {
  try {
    await connectMongoDB();
    const { email, password, verifiedId } = await req.json();
    
    const vendor = await Vendor.findOne({ 
      email,
      password,  
      _id: verifiedId  // Assuming verifiedId is the MongoDB ObjectId
    });

    if (!vendor) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json({ vendor });
    
  } catch (error) {
    console.error("Error retrieving vendor:", error);
    return NextResponse.json(
      { message: "An error occurred while retrieving the vendor." }, 
      { status: 500 }
    );
  }
}
