import { Request, Response } from "express";
import { sequelize } from "../config"; 
import Order from "../models/sqlModel/Order";
import OrderItem from "../models/sqlModel/OrderItem"; 
import { CartItem } from "../models/mongodbModel/Cart"; 
import { IProduct } from "../models/mongodbModel/Product"; 

export const checkout = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.body;

        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }

        const transaction = await sequelize.transaction();

        try {
            // Fetch cart items and populate product data
            const cartItems = await CartItem.find({ userId }).populate<{ productId: IProduct }>("productId");

            if (cartItems.length === 0) {
                await transaction.rollback();
                res.status(400).json({ message: "Cart is empty. Cannot proceed to checkout." });
                return;
            }

            let totalPrice = 0;
            const orderItemsData = cartItems.map((cartItem) => {
                const product = cartItem.productId;
                if (!product) throw new Error(`Product not found: ${cartItem.productId}`);

                const itemTotal = cartItem.quantity * product.price;
                totalPrice += itemTotal;

                return {
                    productId: product._id.toString(),
                    quantity: cartItem.quantity,
                    price: product.price,
                };
            });

            // ✅ Create new order in SQL database
            const newOrder = await Order.create(
                { userId, totalPrice },
                { transaction }
            );

            // ✅ Create order items
            const orderItemsWithOrderId = orderItemsData.map((item) => ({
                orderId: newOrder.id,
                ...item,
            }));

            await OrderItem.bulkCreate(orderItemsWithOrderId, { transaction });

            // ✅ Clear the user's cart
            await CartItem.deleteMany({ userId });

            await transaction.commit();
            res.status(201).json({ success: true, orderId: newOrder.id });
        } catch (error) {
            await transaction.rollback();
            console.error("Checkout failed:", error);
            res.status(500).json({ message: "Checkout failed", error });
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
