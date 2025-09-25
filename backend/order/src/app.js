const express = require("express")
const router = require("./routes/order.routes")
const cookieParser = require("cookie-parser")



const app = express()

app.use(cookieParser())

// Middleware
app.use(express.json()) 

app.use("/api/order", router)


module.exports = app