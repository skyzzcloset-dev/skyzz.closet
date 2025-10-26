const express = require("express"); // Import Express
const cookieParser = require("cookie-parser"); // For parsing cookies
const cors = require("cors"); // For handling cross-origin requests
const productRoutes = require("./routes/product.routes"); // Import your product routes

const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// ✅ CORS setup
const origins = (
  process.env.FRONTEND_ORIGINS || "http://localhost:5173,http://localhost:5174"
)
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      if (origins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS policy: Origin not allowed"));
      }
    },
    credentials: true, // important for cookies
    exposedHeaders: ["set-cookie"],
  })
);
// ✅ Routes
app.use("/api/product", productRoutes); // Mount product routes at /api/product

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

module.exports = app; // Export app to be used in server.js
