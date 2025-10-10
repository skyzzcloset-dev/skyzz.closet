const express = require("express");
const cookieParser = require("cookie-parser");
const router = require("./routes/delivery.routes");
const cors = require("cors");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["https://www.skyzzcloset.shop", "http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use("/api/deliver", router);

module.exports = app;
