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
    password: {type: String, required: true},
    // phone: {type: String, trim: true},
  //   address: {
  //     street: {type: String, required: true},
  //     city: {type: String, required: true},
  //     state: {type: String, required: true},
  //     zip: {type: String, required: true},
  //     country: {type: String, required: true},
  //   },
    role: {type: String, enum: ["customer", "admin"], default: "customer"},
  //   profilePicture: {type: String}, // URL or file path
  //   wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}], // optional
  //   cart: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}], // optional
   },
  {timestamps: true}
);

const User = mongoose.model("User", userSchema);
module.exports = User;
