require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/User");
const Product = require("./models/Product");

const test = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await User.create({
    firstName: "Subhan",
    lastName: "Test",
    email: "subhan@test.com",
    password: "123456",
  });

  await Product.create({
    name: "Test Product",
    price: 10,
    barcode: "123456789",
  });

  console.log("Collections created successfully");
  mongoose.disconnect();
};

test();
