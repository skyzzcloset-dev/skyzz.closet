const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true },
    currency: { type: String, enum: ["USD", "IND"], default: "IND" },

    category: { type: String, ref: "Category", required: true },
    stock: { type: Number, default: 0 },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    images: [
      {
        url: { type: String, required: true },
        fileId: { type: String, required: true },
      },
    ],
    admin: { type: mongoose.Schema.Types.ObjectId, required: true },

    sku: {
      type: String,
      unique: true,
      trim: true,
      default: () => `SKU-${Date.now()}`,
    },
    brand: { type: String, trim: true },
    ratings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Virtual field for stock message
productSchema.virtual("stockMessage").get(function () {
  if (this.stock === 0) return "Out of stock";
  if (this.stock === 1) return "Hurry! Only 1 left";
  if (this.stock <= 3) return `Only ${this.stock} left`;
  return "In stock";
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
