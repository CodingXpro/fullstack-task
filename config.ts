import { Sequelize } from "sequelize";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Sequelize (MySQL) Connection (For Users & Orders)
export const sequelize = new Sequelize(
  process.env.MYSQL_DB as string,
  process.env.MYSQL_USER as string,
  process.env.MYSQL_PASSWORD as string,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// MongoDB Connection (For Products)
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Test MySQL Connection
export const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL using Sequelize");
  } catch (error) {
    console.error("MySQL connection error:", error);
  }
};
