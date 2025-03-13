import express from "express";
import { createOrder } from "../controllers/OrderController";

const router = express.Router();

// ✅ Route for creating an order
router.post("/create", createOrder);

export default router;
