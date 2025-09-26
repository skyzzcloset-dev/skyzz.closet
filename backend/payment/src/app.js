const express = require("express")
const router = require("./routes/payment.route")
const cookieParser = require("cookie-parser")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/api/payment" , router)

module.exports = app