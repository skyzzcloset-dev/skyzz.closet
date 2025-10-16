const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routes = require("./routes/auth.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["https://www.skyzzcloset.shop", "http://localhost:5174"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use("/api/auth", routes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

module.exports = app;  // ✅ Only this
