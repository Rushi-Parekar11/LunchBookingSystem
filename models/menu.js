import mongoose, { Schema, models } from "mongoose";

const menuSchema = new Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true
    },
    description:{
      type:String,
      required:true
    },
    type:{
      type:String,
      required:true
    },
    imageUrl:{
      type:String,
      required:true
    },
    price: {
      type: Number,
      required: true
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true
    }
  },
  { timestamps: true }
);

const Menu = models.Menu || mongoose.model("Menu", menuSchema);
export default Menu;
