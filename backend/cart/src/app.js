const express = require("express");
const router = require("./routes/cart.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
    optionsSuccessStatus: 200,
    exposedHeaders: ["set-cookie"],
  })
);

// Routes
app.use("/api/cart", router);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

module.exports = app;
