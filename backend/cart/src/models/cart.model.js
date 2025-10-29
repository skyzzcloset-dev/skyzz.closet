const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {type: mongoose.Types.ObjectId, required: true},
    items: [
      {
        productId: {type: mongoose.Types.ObjectId, required: true},
        quantity: {type: Number, required: true, min: 1},
        sizes: [{type: String}],
        colors: [{type: String}],
      },
    ],
  },
  {timestamps: true}
);

module.exports = mongoose.model("cart", cartSchema);
