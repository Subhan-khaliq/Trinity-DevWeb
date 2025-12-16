const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: String,
    email: { type: String, required: true, unique: true },
    address: String,
    zipcode: String,
    city: String,
    country: String,
    role: {
      type: String,
      enum: ["admin", "customer", "manager"],
      default: "customer",
    },
    refreshToken: String,
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);