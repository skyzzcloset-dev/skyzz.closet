// config/connectToDB.js
const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGOOSE_KEY);
    console.log("✅ Connected to DB");
  } catch (err) {
    console.error("❌ Error connecting DB:", err.message);
    process.exit(1);
  }
}

module.exports = connectToDB;
