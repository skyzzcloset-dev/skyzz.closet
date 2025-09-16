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
    origin: "https://skyzzcloset.netlify.app", // no trailing slash
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});
module.exports = app;
