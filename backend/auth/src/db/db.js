const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.MONGOOSE_KEY)
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.log("Error connecting to DB:", err);
    });
}

module.exports = connectToDB;
