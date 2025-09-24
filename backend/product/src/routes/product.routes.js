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
const {
  createProductValidations,
} = require("../middlewares/validate.middleware");

const router = express.Router();

// Protected Admin Routes
router.post(
  "/add",
  createAuthMiddleware(["admin"]),
  uploadMultiple("images", 7),
  createProductValidations,
  addProduct
);
router.patch("/update/:id", createAuthMiddleware(["admin"]), updateProduct);
router.delete("/delete/:id", createAuthMiddleware(["admin"]), deleteProduct);

// Public Routes

router.get("/getAll", allProducts);
router.get("/count", countProduct);
router.get("/get/:id", singleProduct);

module.exports = router;
