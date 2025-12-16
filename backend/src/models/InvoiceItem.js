const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true },
    subtotal: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InvoiceItem", invoiceItemSchema);