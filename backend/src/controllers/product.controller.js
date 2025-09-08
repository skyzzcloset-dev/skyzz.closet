const {v4: uuidv4} = require("uuid");
const uploadFile = require("../services/imagekit.service");
const productModel = require("../models/product.model");

async function addProduct(req, res) {
  try {
    const {name, description, price, stock, sizes, category} = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({error: "No image uploaded"});
    }

    // uploading to ImageKit
    const uploadImages = [];

    for (const file of files) {
      const base64Image = file.buffer.toString("base64");

      const result = await uploadFile(
        base64Image,
        `${uuidv4()}-${file.originalname}`,
        `products/${category}`
      );

      uploadImages.push({url: result.url, fileId: result.fileId});
    }
    const product = await productModel.create({
      name,
      description,
      price,
      stock,
      sizes,
      colors, 
      category,
      images: uploadImages,
      sku,
      brand,
      ratings,
    });
    res.status(201).json({
      message: "Product Added Successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

async function allProduct(req, res) {
  try {
    const allProduct = await productModel.find();

    if (!allProduct) {
      return res.status(400).json({message: "You Dont have Any Product"});
    }

    return res
      .status(201)
      .json({message: "Products Fetched", products: allProduct});
  } catch (error) {
    res.status(500).json({error: err.message});
  }
}

async function singleProduct(req, res) {
  try {
    const singleProduct = await productModel.findById(req.params.id);

    if (!singleProduct) {
      return res.status(404).json({message: "Product not found"});
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      product: singleProduct,
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

async function updateProduct(req, res) {
  try {
    const updatedProduct = await productModel
      .findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
      .select("-__v");

    if (!updatedProduct) {
      return res.status(404).json({message: "Product not found"});
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

async function deleteProduct(req, res) {
  try {
    const deleteProduct = await productModel.findOneAndDelete(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!deleteProduct) {
      return res.status(404).json({message: "Product not found"});
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deleteProduct,
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

module.exports = {
  addProduct,
  allProduct,
  singleProduct,
  updateProduct,
  deleteProduct,
};
