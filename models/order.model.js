const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    pizza: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pizza", // Pizza modeli bilan bog'lanadi
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User modeli bilan bog'lanadi
      required: true,
    },
    status: {
      type: String,
      enum: ["Tayyorlanmoqda", "Yetkazilmoqda", "Yetib keldi"],
      default: "Tayyorlanmoqda", // Boshlang'ich status
    },
    createdAt: {
      type: Date,
      default: Date.now, // Buyurtma yaratilgan vaqti
    },
  },
  { timestamps: true } // Avtomatik createdAt va updatedAt maydonlarini qo'shadi
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
