import { connectMongoDB } from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Vendor from "../../../../models/vendor";


export async function POST(req) {
  try {
    const { name, phone, email, password,shopName, address } = await req.json();

    // If you want to hash the password for security (similar to user registration):
    const hashedPassword = await bcrypt.hash(password, 10);

    await connectMongoDB();

    // Create a new vendor with hashed password and other details
    await Vendor.create({
      name,
      phone,
      email,
      shopName,
      address,
      password: hashedPassword, // Save the hashed password, if applicable
    });

    return NextResponse.json({ message: "Vendor registered." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while registering the vendor." },
      { status: 500 }
    );
  }
}
