const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routes = require("./routes/auth.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Dynamic origins
const origins = (process.env.FRONTEND_ORIGINS || "http://localhost:5173,https://www.skyzzcloset.shop")
  .split(",")
  .map(o => o.trim());

app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      if (origins.indexOf(origin) !== -1) return callback(null, true);
      return callback(new Error("CORS policy: Origin not allowed"));
    },
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

// Routes
app.use("/api/auth", routes);

app.get("/", (req, res) => res.send("Backend running!"));

module.exports = app;
