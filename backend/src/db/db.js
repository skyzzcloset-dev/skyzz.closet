const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.MONGOOSE_KEY)
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.log("Error :-", err);
    });
}

module.exports = connectToDB;
