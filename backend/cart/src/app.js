const express = require("express");
const router = require("./routes/cart.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

// ✅ CORS setup (frontend: Vercel, allow cookies)
app.use(
  cors({
    origin: ["https://www.skyzzcloset.shop", "http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
// Routes
app.use("/api/cart", router);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});
module.exports = app;
