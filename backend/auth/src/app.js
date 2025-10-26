const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routes = require("./routes/auth.routes");

const app = express();
exports.app = app;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// ✅ CORS setup (frontend: Vercel, allow cookies)
app.use(
  cors({
    origin: ["https://www.skyzzcloset.shop", "http://localhost:5173"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

// Routes
app.use("/api/auth", routes);

app.get("/", (req, res) => res.send("Backend running!"));

module.exports = app;
