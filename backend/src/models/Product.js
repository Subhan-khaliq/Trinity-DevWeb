import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    brand: String,
    picture: String,
    category: String,
    nutritionalInformation: { type: Map, of: String }, // Store key-value pairs like Energy: 100kcal
    availableQuantity: { type: Number, default: 0 },
    barcode: { type: String, unique: true },
    openFoodFactsData: { type: Object }, // Full JSON from API
    lastUpdatedFromAPI: Date,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
