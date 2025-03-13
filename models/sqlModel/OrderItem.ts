import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config";
import Order from "./Order";

class OrderItem extends Model {}

OrderItem.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Order, key: "id" },
    },
    productId: { type: DataTypes.STRING, allowNull: false }, // References MongoDB Product ID
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    sequelize,
    tableName: "order_items",
  }
);

export default OrderItem;
