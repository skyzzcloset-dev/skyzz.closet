const express = require("express");
const cookieParser = require("cookie-parser");
const routes = require("./routes/index");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup
app.use(
  cors({
    origin: "https://skyzzcloset.vercel.app",
    credentials: true,
  })
);

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

module.exports = app;
