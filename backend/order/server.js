require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/db/db");

const PORT = process.env.PORT || 3003;
connectToDB();
app.listen(PORT, () => {
  console.log(`Server Running on PORT ${PORT}`);
});
