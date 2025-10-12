const express = require("express");
const router = require("./routes/payment.route");
const cookieParser = require("cookie-parser");
const cors = require("cors")

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["https://www.skyzzcloset.shop", "http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use("/api/payment", router);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

module.exports = app;
