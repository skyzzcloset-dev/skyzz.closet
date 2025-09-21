require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/db/db"); 

const PORT = process.env.PORT || 8000;

// Connect to Database
connectToDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 


