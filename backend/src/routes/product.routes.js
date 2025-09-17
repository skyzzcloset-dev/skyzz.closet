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
router.post("/add", authMiddleware, adminPage, uploadMultiple("images", 7), addProduct);
router.get("/getAll", authMiddleware, adminPage, allProducts);
router.get("/products", authMiddleware, adminPage, allProducts);
router.get("/get/:id", authMiddleware, adminPage, singleProduct);
router.put("/update/:id", authMiddleware, adminPage, updateProduct);
router.delete("/delete/:id", authMiddleware, adminPage, deleteProduct);

module.exports = router;
