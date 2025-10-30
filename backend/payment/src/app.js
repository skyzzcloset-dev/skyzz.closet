const express = require("express");
const router = require("./routes/payment.route");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

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
    optionsSuccessStatus: 200,
    exposedHeaders: ["set-cookie"],
  })
);

// ✅ Routes
app.use("/api/payment", router);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

module.exports = app;
