const { v4: uuidv4 } = require("uuid");
const uploadFile = require("../services/imagekit.service");
const productModel = require("../models/product.model");
const mongoose = require("mongoose");

// ✅ Add product
async function addProduct(req, res) {
  try {
    const { name, description, price, stock, sizes, colors, category, brand } =
      req.body;

    if (!name || !description || !price || !stock || !category || !brand) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const admin = req.user?.id;
    if (!admin) {
      return res.status(400).json({ error: "Admin ID is required" });
    }

    const uploadImages = await Promise.all(
      (req.files || []).map(async (file) => {
        const result = await uploadFile(
          file.buffer.toString("base64"),
          `${uuidv4()}-${file.originalname}`,
          category
        );
        return { url: result.url, fileId: result.fileId };
      })
    );

    if (!uploadImages || uploadImages.length === 0) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const product = await productModel.create({
      name,
      description,
      price,
      stock,
      sizes,
      colors,
      category,
      brand,
      admin,
      images: uploadImages,
    });

    res.status(201).json({ message: "Product Added Successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// ✅ Get all products
// controllers/product.controller.js
async function allProducts(req, res) {
  const { q, maxPrice, minPrice, category, skip = 0, limit = 20 } = req.query;
  try {
    const filter = {};
    
    if (q) filter.$text = { $search: q };
    if (category) filter.category = category; // ✅ filter by category

    if (minPrice) {
      filter["price.amount"] = { ...filter["price.amount"], $gte: Number(minPrice) };
    }
    if (maxPrice) {
      filter["price.amount"] = { ...filter["price.amount"], $lte: Number(maxPrice) };
    }

    const products = await productModel
      .find(filter)
      .skip(Number(skip))
      .limit(Math.min(Number(limit), 20));

    res.status(200).json({ message: "All Products fetched", products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// ✅ Get single product
async function singleProduct(req, res) {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product fetched successfully", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function updateProduct(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  const product = await productModel.findOne({ _id: id, admin: req.user.id });
  if (!product) return res.status(404).json({ message: "Product not found" });

  const allowedUpdates = ["name", "description", "price", "category", "stock", "brand"];
  for (const key of Object.keys(req.body)) {
    if (allowedUpdates.includes(key)) {
      if (key === "price") {
        product.price = Number(req.body.price);
      } else {
        product[key] = req.body[key];
      }
    }
  }

  await product.save();
  res.status(200).json({ message: "Product updated successfully", product });
}

// ✅ Delete product
async function deleteProduct(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }

  const product = await productModel.findOne({ _id: id });
  if (!product) return res.status(404).json({ message: "Product not Found" });

  if (product.admin.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Forbidden : You can delete your own products" });
  }

  await product.deleteOne();
  return res.status(200).json({ message: "Product deleted" });
}

// ✅ Count products
async function countProduct(req, res) {
  try {
    const count = await productModel.countDocuments();
    res.status(200).json({ message: "Count Fetch Successfully", count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  addProduct,
  allProducts,
  singleProduct,
  updateProduct,
  deleteProduct,
  countProduct,
};
