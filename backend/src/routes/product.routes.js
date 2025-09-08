const express = require("express");
const {
  addProduct,
  allProduct,
  updateProduct,
  singleProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const {authMiddleware, adminPage} = require("../middleware/auth.middleware");
const {

  uploadMultiple,
} = require("../middleware/upload.middleware");


const router = express.Router();

router.post(
  "/products",
  authMiddleware,
  adminPage,
  uploadMultiple("images", 7),
  addProduct
);
router.get("/products", authMiddleware, adminPage, allProduct);
router.get("/products/:id", authMiddleware, adminPage, singleProduct);
router.put("/products/:id", authMiddleware, adminPage, updateProduct);
router.delete("/products/:id", authMiddleware, adminPage, deleteProduct);

module.exports = router;
