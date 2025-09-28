const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const productRoutes = require("./routes/product.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup (frontend: Vite/Vercel)
app.use(
  cors({
    origin: "https://www.skyzzcloset.shop",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// ✅ Routes
app.use("/api/product", productRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

module.exports = app;
