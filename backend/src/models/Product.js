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
    labels: [String],
    ingredients: String,
    allergens: [String],
    isGlutenFree: { type: Boolean, default: false },
    isVegan: { type: Boolean, default: false },
    isVegetarian: { type: Boolean, default: false },
    openFoodFactsData: { type: Object }, // Full JSON from API
    lastUpdatedFromAPI: Date,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
