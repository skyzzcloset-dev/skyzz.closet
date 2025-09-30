require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/db/db")

const PORT = process.env.PORT || 3006

connectToDB()

app.listen(PORT , ()=>{
    console.log("Server is running on PORT :-" , PORT);
})