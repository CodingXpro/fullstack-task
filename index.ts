import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import cartRoutes from './routes/cartRoutes';

dotenv.config();

const app = express();

app.use(express.json()); // Middleware to parse JSON

// Use auth routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
