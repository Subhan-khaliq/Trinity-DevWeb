import InvoiceItem from "../models/InvoiceItem.js";

export const createInvoiceItem = async (req, res) => {
  try {
    const item = await InvoiceItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getInvoiceItems = async (req, res) => {
  const items = await InvoiceItem.find()
    .populate("invoice")
    .populate("product");
  res.json(items);
};

export const getInvoiceItemById = async (req, res) => {
  const item = await InvoiceItem.findById(req.params.id)
    .populate("invoice")
    .populate("product");

  if (!item) return res.status(404).json({ message: "Invoice item not found" });
  res.json(item);
};

export const updateInvoiceItem = async (req, res) => {
  const item = await InvoiceItem.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(item);
};

export const deleteInvoiceItem = async (req, res) => {
  await InvoiceItem.findByIdAndDelete(req.params.id);
  res.json({ message: "Invoice item deleted" });
};
