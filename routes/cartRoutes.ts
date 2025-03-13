import express from "express";
import { checkout } from "../controllers/CartController";

const router = express.Router();

// Route should directly use `checkout`, no need for extra async wrapper
router.post("/checkout", checkout);

export default router;
