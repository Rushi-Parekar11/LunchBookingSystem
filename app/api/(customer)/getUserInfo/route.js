import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import mongoose from "mongoose";


export async function GET(req) {
  try {
    await connectMongoDB();

    const customerId = req.nextUrl.searchParams.get("customerId"); // Get query param from URL
    // console.log(customerId);

    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return new Response(JSON.stringify({ error: "Invalid customer ID" }), {
        status: 400,
      });
    }

    const user = await User.findById(customerId);
    
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ user }), {
      status: 200,
    });

  } catch (error) {
    console.error("Error fetching user info:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
