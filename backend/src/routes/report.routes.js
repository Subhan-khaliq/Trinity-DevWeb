import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { generateReport, getReports, deleteReport } from "../controllers/report.controller.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize(['admin'])); // All report routes are admin only

router.post("/generate", generateReport); // Trigger new report generation
router.get("/", getReports); // Get history
router.delete("/:id", deleteReport);

export default router;
