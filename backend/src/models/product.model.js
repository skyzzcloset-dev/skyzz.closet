const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // product name
    description: { type: String, trim: true },
    price: { type: Number, required: true }, // use number for calculations
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, default: 0 },
    sizes: [{ type: String }], // e.g., ["S","M","L","XL"]
    colors: [{ type: String }], // optional
    images: [
      {
        url: { type: String, required: true },    // ImageKit URL
        fileId: { type: String, required: true }, // ImageKit fileId for delete/transform
      },
    ],
    sku: { type: String, unique: true, trim: true }, // product identifier
    brand: { type: String, trim: true },
    ratings: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
