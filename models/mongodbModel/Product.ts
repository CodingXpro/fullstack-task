import mongoose, { Document} from "mongoose";

export interface IProduct extends Document {
    _id: mongoose.Types.ObjectId; // Explicitly add _id
    name: string;
    price: number;
    category?: string;
    stock: number;
  }

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  stock: { type: Number, required: true },
});

export const Product = mongoose.model("Product", productSchema);
