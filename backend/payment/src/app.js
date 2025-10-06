const express = require("express");
const router = require("./routes/payment.route");
const cookieParser = require("cookie-parser");
const cors = require("cors")

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/payment", router);

module.exports = app;
