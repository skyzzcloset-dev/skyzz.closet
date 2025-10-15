const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      firstName: {type: String, required: true, trim: true},
      lastName: {type: String, trim: true},
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {type: String, select: false},

    role: {type: String, enum: ["customer", "admin"], default: "customer"},
  },
  {timestamps: true}
);

const User = mongoose.model("User", userSchema);
module.exports = User;
