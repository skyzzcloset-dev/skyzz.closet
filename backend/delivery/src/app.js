const express = require("express")
const cookieParser = require("cookie-parser")
const router = require("./routes/delivery.routes")

const app = express()
app.use(cookieParser())


app.use("/api/deliver" , router)

module.exports = app