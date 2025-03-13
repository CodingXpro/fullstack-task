import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // References User ID (SQL)
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // References Product (MongoDB)
  quantity: { type: Number, required: true },
});

// Create Model
export const CartItem = mongoose.model("CartItem", cartItemSchema);
