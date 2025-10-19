require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/db/db")


const PORT = process.env.PORT ||3004

connectToDB()
app.listen(PORT , ()=>{
    console.log("Server is Running on PORT " , PORT);  
})