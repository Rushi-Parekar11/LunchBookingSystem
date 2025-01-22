import mongoose from "mongoose";

export async function connectMongoDB() {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    throw new Error("MongoDB connection failed");
  }
}
