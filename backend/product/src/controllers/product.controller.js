const {v4: uuidv4} = require("uuid");
const uploadFile = require("../services/imagekit.service");
const productModel = require("../models/product.model");

// ✅ Add product
async function addProduct(req, res) {
  try {
    const {name, description, price, stock, sizes, colors, category, brand} =
      req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({error: "No image uploaded"});
    }

    const admin = req.user.id;
    if (!admin) {
      return res.status(400).json({error: "Admin ID is required"});
    }

    const uploadImages = [];

    const files = await Promise.all(
      (req.files || []).map(async (file) =>
        uploadFile(
          file.buffer.toString("base64"),
          `${uuidv4()}-${file.originalname}`,
          category
        )
      )
    );
    uploadImages.push({url: result.url, fileId: result.fileId});

    const product = await productModel.create({
      name,
      description,
      price,
      stock,
      sizes: sizes ? sizes.split(",") : [],
      colors: colors ? colors.split(",") : [],
      category,
      brand,
      images: uploadImages,
    });

    res.status(201).json({message: "Product Added Successfully", product});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err.message});
  }
}

// ✅ Get all products
async function allProducts(req, res) {
  try {
    const products = await productModel.find();
    res.status(200).json({message: "Products Fetched", products});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

// ✅ Get single product
async function singleProduct(req, res) {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) return res.status(404).json({message: "Product not found"});
    res.status(200).json({message: "Product fetched successfully", product});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

// ✅ Update product
async function updateProduct(req, res) {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!product) return res.status(404).json({message: "Product not found"});
    res.status(200).json({message: "Product updated successfully", product});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

// ✅ Delete product
async function deleteProduct(req, res) {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({message: "Product not found"});
    res.status(200).json({message: "Product deleted successfully", product});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

async function countProduct(req, res) {
  try {
    const count = await productModel.countDocuments();
    if (!count) {
      return res.status(400).json({message: "Bad Request"});
    }
    res.status(200).json({message: "Count Fetch Successfully"});
  } catch (error) {
    res.status(500).json({error: err.message});
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
