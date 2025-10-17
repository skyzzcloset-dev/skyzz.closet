const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const orderRouter = require("./routes/order.routes");

const app = express();

// ✅ Parse cookies & JSON body
app.use(cookieParser());
app.use(express.json());

// ✅ CORS setup: must be before routes
app.use(
  cors({
    origin: ["https://www.skyzzcloset.shop", "http://localhost:5173"], // allowed frontends
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // important for cookies
  })
);

// ✅ Add a small middleware to log requests (optional, useful for debugging Railway issues)
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

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

module.exports = app;
