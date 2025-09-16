const express = require("express");
const {
  addProduct,
  allProducts,
  singleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const { authMiddleware, adminPage } = require("../middleware/auth.middleware");
const { uploadMultiple } = require("../middleware/upload.middleware");

const router = express.Router();

// Routes
router.post("/products", authMiddleware, adminPage, uploadMultiple("images", 7), addProduct);
router.get("/products", authMiddleware, adminPage, allProducts);
router.get("/products/:id", authMiddleware, adminPage, singleProduct);
router.put("/products/:id", authMiddleware, adminPage, updateProduct);
router.delete("/products/:id", authMiddleware, adminPage, deleteProduct);

module.exports = router;
