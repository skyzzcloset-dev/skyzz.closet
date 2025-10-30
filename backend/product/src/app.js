const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const productRoutes = require("./routes/product.routes");

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup (frontend: Vercel, allow cookies)
app.use(
  cors({
    origin: [
      "https://www.skyzzcloset.shop",
      "https://skyzzcloset.shop", // added non-www for mobile compatibility
      "http://localhost:5173",
    ],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

// ✅ Routes
app.use("/api/product", productRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

module.exports = app;
