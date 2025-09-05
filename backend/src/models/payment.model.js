const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["card", "upi", "netbanking", "cod"], required: true },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    transactionId: { type: String, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
