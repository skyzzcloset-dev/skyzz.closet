const express = require("express");
const {
  addProduct,
  allProducts,
  singleProduct,
  updateProduct,
  deleteProduct,
  countProduct,
} = require("../controllers/product.controller");
const {createAuthMiddleware} = require("../middlewares/auth.middleware");
const {uploadMultiple} = require("../middlewares/upload.middleware");
const {createProductValidations} = require("../middlewares/validate.middleware");

const router = express.Router();

// Protected Admin Routes
router.post(
  "/add",
  createAuthMiddleware(["admin"]),
  uploadMultiple("images", 7),
  createProductValidations,
  addProduct
);
router.get("/getAll", allProducts);
router.get("/count", countProduct);
router.get("/get/:id", singleProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
