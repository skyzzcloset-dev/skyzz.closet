const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const orderRouter = require("./routes/order.routes");

const app = express();

// ✅ Parse cookies & JSON body
app.use(cookieParser());
app.use(express.json());

// ✅ CORS setup (frontend: Vercel, allow cookies)
app.use(
  cors({
    origin: [
      "https://www.skyzzcloset.shop",
      "https://skyzzcloset.shop", // added non-www for mobile compatibility
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

// ✅ Optional: Log requests (useful for debugging on Railway)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ✅ Routes
app.use("/api/order", orderRouter);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ✅ Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

module.exports = app;
