const express = require("express");
const cookieParser = require("cookie-parser");
const routes = require("./routes/index");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup (allow cookies + frontend URL)
app.use(
  cors({
    origin: "http://localhost:5173", // no trailing slash
    credentials: true,              // allow cookies/session headers
    optionsSuccessStatus: 200,
  })
);

app.use("/api", routes);

module.exports = app;
