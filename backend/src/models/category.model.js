const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
