import express from "express";
import {
  createInvoiceItem,
  getInvoiceItems,
  getInvoiceItemById,
  updateInvoiceItem,
  deleteInvoiceItem
} from "../controllers/invoiceItem.controller.js";

const router = express.Router();

router.post("/", createInvoiceItem);
router.get("/", getInvoiceItems);
router.get("/:id", getInvoiceItemById);
router.put("/:id", updateInvoiceItem);
router.delete("/:id", deleteInvoiceItem);

export default router;
