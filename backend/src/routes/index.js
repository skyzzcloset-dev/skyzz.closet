const express = require("express");
const router = express.Router();


const authRoutes = require("../routes/auth.routes");
const userRoutes = require("../routes/user.route");
const productRoutes = require("../routes/product.routes");
// const categoryRoutes = require("../routes/categoryRoutes");
// const cartRoutes = require("../routes/cartRoutes");
// const orderRoutes = require("../routes/orderRoutes");
// const paymentRoutes = require("../routes/paymentRoutes");
// const reviewRoutes = require("../routes/reviewRoutes");
// const addressRoutes = require("../routes/addressRoutes");

router.use("/auth", authRoutes);
router.use("/", userRoutes);
router.use("/product", productRoutes);
// router.use("/", categoryRoutes);
// router.use("/", cartRoutes);
// router.use("/", orderRoutes);
// router.use("/", paymentRoutes);
// router.use("/", reviewRoutes);
// router.use("/", addressRoutes);

module.exports = router;
