const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
  zip: {type: String, required: true},
  country: {type: String, required: true},
});

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
    password: {type: String , select: false, required: true},
    address: [addressSchema],
    role: {type: String, enum: ["customer", "admin"], default: "customer"},
  },
  {timestamps: true}
);

const User = mongoose.model("User", userSchema);
module.exports = User;
