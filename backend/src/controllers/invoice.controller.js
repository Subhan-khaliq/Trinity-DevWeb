import Invoice from "../models/Invoice.js";
import InvoiceItem from "../models/InvoiceItem.js";
import Product from "../models/Product.js";
import { sendReceiptEmail } from "../utils/emailService.js";
import User from "../models/User.js";

export const createInvoice = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body; // items: [{ productId, quantity }]
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    let totalAmount = 0;
    const invoiceItemsData = [];

    // Validate Items and Calculate Total
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      if (product.availableQuantity < item.quantity) {
        throw new Error(`Not enough stock for ${product.name}`);
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      invoiceItemsData.push({
        productId: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
        subtotal
      });
    }

    // Create Invoice
    const invoice = await Invoice.create({
      userId,
      totalAmount,
      paymentMethod,
      paymentStatus: "paid" // Simulating immediate payment success
    });

    // Create Invoice Items and Update Stock
    for (const itemData of invoiceItemsData) {
      await InvoiceItem.create({
        invoiceId: invoice._id,
        ...itemData
      });

      await Product.findByIdAndUpdate(itemData.productId, {
        $inc: { availableQuantity: -itemData.quantity }
      });
    }

    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.userId = req.user.id;
    }
    const invoices = await Invoice.find(query).populate("userId", "firstName lastName email");
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("userId", "firstName lastName email");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // Check permission
    const orderUserId = invoice.userId._id || invoice.userId;
    if (req.user.role !== 'admin' && orderUserId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Get items
    const items = await InvoiceItem.find({ invoiceId: invoice._id }).populate("productId", "name price");

    res.json({ ...invoice.toObject(), items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    // Also delete items? Yes.
    await InvoiceItem.deleteMany({ invoiceId: req.params.id });
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const emailReceipt = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // Check permission (only own receipt or admin)
    if (req.user.role !== 'admin' && invoice.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Fetch full details
    const items = await InvoiceItem.find({ invoiceId: invoice._id }).populate("productId", "name price");
    const user = await User.findById(invoice.userId);

    if (!user || !user.email) {
      return res.status(400).json({ message: "User email not found" });
    }

    const orderData = { ...invoice.toObject(), items };
    const previewUrl = await sendReceiptEmail(user, orderData);

    res.json({
      message: "Receipt emailed successfully!",
      previewUrl // Useful for demo/Ethereal
    });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
};
