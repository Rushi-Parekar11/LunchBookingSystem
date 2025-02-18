import { connectMongoDB } from "@/lib/mongodb";
import Menu from "@/models/menu";

export async function PATCH(req) {
  try {
    await connectMongoDB();
    
    const { _id, menuDate, ...updateData } = await req.json();
    if (!_id) {
      return Response.json({ message: "Menu ID is required" }, { status: 400 });
    }

    if (menuDate) {
      updateData.menuDate = menuDate;
    }

    const updatedMenu = await Menu.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedMenu) {
      return Response.json({ message: "Menu not found" }, { status: 404 });
    }

    return Response.json(updatedMenu, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
