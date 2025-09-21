const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routes = require("./routes/auth.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup (frontend: Vercel, allow cookies)
app.use(
  cors({
    origin: "https://www.skyzzcloset.shop",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Routes
app.use("/api/auth", routes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

module.exports = app;