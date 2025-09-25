const mongoose = require("mongoose");
const {stringify: uuidStringify} = require("uuid");

const shippingSchema = new mongoose.Schema({
  street: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
  zip: {type: String, required: true},
  country: {type: String, required: true},
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        price: {
          amount: {
            type: Number,
            required: true,
          },
          currency: {
            type: String,
            required: true,
            enum: ["USD", "INR"],
            default: "INR",
          },
        },
      },
    ],
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "SHIPPED", "DELIVERED"],
    },
    totalAmount: {
      price: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        enum: ["USD", "INR"],
        required: true,
      },
    },
    shippingAddress: {
      type: shippingSchema,
      required: true,
    },
  },
  {timestamps: true}
);

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
