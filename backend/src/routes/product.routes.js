import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  syncWithOpenFoodFacts
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts); // Public?
router.get("/:id", getProductById); // Public?

// Protected Routes
router.use(authenticate);
router.post("/sync", authorize(['admin']), syncWithOpenFoodFacts);
router.post("/", authorize(['admin']), createProduct);
router.put("/:id", authorize(['admin']), updateProduct);
router.delete("/:id", authorize(['admin']), deleteProduct);

export default router;
