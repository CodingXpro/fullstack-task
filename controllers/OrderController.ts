import { Request, Response } from "express";
import { sequelize } from "../config";
import Order from "../models/sqlModel/Order"; // SQL Order Model
import OrderItem from "../models/sqlModel/OrderItem"; // SQL OrderItem Model
import { CartItem } from "../models/mongodbModel/Cart"; // MongoDB Cart Model
import { IProduct } from "../models/mongodbModel/Product"; // MongoDB Product Interface
import mongoose from "mongoose";



export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ error: "User ID is required." });
    return;
  }

  const transaction = await sequelize.transaction();
  try {
    // ✅ Step 1: Fetch user's cart items from MongoDB
    const cartItems = await CartItem.find({ userId }).populate<{ productId: IProduct }>("productId");

    if (cartItems.length === 0) {
      await transaction.rollback();
      res.status(400).json({ error: "Cart is empty. Cannot create an order." });
      return;
    }

    // ✅ Step 2: Calculate total price & prepare order items
    let totalPrice = 0;
    const orderItemsData = cartItems.map((cartItem) => {
      const product = cartItem.productId;
      if (!product) {
        throw new Error(`Product not found: ${cartItem.productId}`);
      }

      const itemTotal = cartItem.quantity * product.price;
      totalPrice += itemTotal;

      return {
        productId: product._id.toString(),
        quantity: cartItem.quantity,
        price: product.price,
      };
    });

    // ✅ Step 3: Create Order in SQL
    const newOrder = await Order.create(
      { userId, totalPrice },
      { transaction }
    );

    // ✅ Step 4: Create Order Items in SQL
    const orderItemsWithOrderId = orderItemsData.map((item) => ({
      orderId: newOrder.id,
      ...item,
    }));

    await OrderItem.bulkCreate(orderItemsWithOrderId, { transaction });

    // ✅ Step 5: Clear Cart after successful checkout
    await CartItem.deleteMany({ userId });

    // ✅ Commit transaction
    await transaction.commit();

    res.status(201).json({
      success: true,
      orderId: newOrder.id,
      message: "Order created successfully.",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Order creation failed:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
};


