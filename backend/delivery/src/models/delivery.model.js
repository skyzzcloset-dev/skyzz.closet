const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
  zip: {type: String, required: true},
  country: {type: String, required: true},
});

const deliverySchema = new mongoose.Schema(
  {
   
    order: {type: mongoose.Schema.Types.ObjectId, required: true},
    items: [
      {
        productId: {type: mongoose.Schema.Types.ObjectId, required: true},
        quantity: {type: Number, default: 1, min: 1},
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
    shippingAddress: {type: addressSchema, required: true},
    trackingId: {type: String},
    awbCode: {type: String},
    deliveryStatus: {
      type: String,
      enum: [
        "Created",
        "Shipped",
        "In Transit",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Created",
    },
    estimatedDeliveryDate: Date,
    deliveredDate: Date,
    statusHistory: [{status: String, location: String, dateTime: Date}],
    lastUpdated: {type: Date, default: Date.now},
  },
  {timestamps: true}
);

module.exports = mongoose.model("delivery", deliverySchema);
