const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    brand: String,
    picture: String,
    category: String,
    nutritionalInformation: String,
    availableQuantity: { type: Number, default: 0 },
    barcode: { type: String, unique: true },
    openFoodFactsData: { type: Object }, // JSON
    lastUpdatedFromAPI: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);