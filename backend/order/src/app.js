const express = require("express");
const router = require("./routes/order.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(cookieParser());
app.use(express.json());

// ✅ CORS should be on top, before routes
app.use(
  cors({
    origin: ["https://www.skyzzcloset.shop", "http://localhost:5173"],
    credentials: true,
  })
);

// ✅ Routes after middleware
app.use("/api/order", router);

module.exports = app;
