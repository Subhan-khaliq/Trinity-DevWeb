import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice
} from "../controllers/invoice.controller.js";

const router = express.Router();
router.use(authenticate);

router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.put("/:id", authorize(['admin']), updateInvoice);
router.delete("/:id", authorize(['admin']), deleteInvoice);

export default router;
