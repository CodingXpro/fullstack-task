import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config";

class Order extends Model {
  public id!: number;  // ✅ Explicitly define `id`
  public userId!: string;
  public totalPrice!: number;
}

Order.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.STRING, allowNull: false }, // User reference (SQL)
    totalPrice: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    sequelize,
    tableName: "orders",
  }
);

export default Order;
