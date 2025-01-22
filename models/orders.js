import mongoose, { Schema, models } from "mongoose";

const orderSchema = new Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true
        },
        quantity: {
          type: Number,
          default: 1
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    orderDate: {
      date: {
        type: Number,
        required: true
      },
      dayName: {
        type: String,
        required: true
      },
      month: {
        type: String,
        required: true
      },
      year: {
        type: Number,
        required: true
      }
    },
    status: {
      type: String,
      default: "Pending", 
    },
  },
  { timestamps: true }
);

const Orders = models.Order || mongoose.model("Order", orderSchema);
export default Orders;
