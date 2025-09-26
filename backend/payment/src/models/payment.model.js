const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    order: {type: mongoose.Schema.Types.ObjectId, required: true},
    paymentId: {type: String},
    razorpayOrderId: {type: String, required: true},
    signature: {type: String},
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    user: {type: mongoose.Schema.Types.ObjectId, required: true},
    price: {
      amount: {type: Number, required: true},
      currency: {
        type: String,
        enum: ["USD", "INR"],
        default: "INR",
        required: true,
      },
    },
  },
  {timestamps: true}
);

const paymentModel = mongoose.model("payment", paymentSchema);

module.exports = paymentModel;
