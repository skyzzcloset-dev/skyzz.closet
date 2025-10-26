const express = require("express"); // Import Express
const cookieParser = require("cookie-parser"); // For parsing cookies
const cors = require("cors"); // For handling cross-origin requests
const productRoutes = require("./routes/product.routes"); // Import your product routes

const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());


// ✅ CORS setup (frontend: Vercel, allow cookies)
app.use(
  cors({
    origin: ["https://www.skyzzcloset.shop", "http://localhost:5173"],
    credentials: true,
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
