import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { generateReport, getReports, deleteReport } from "../controllers/report.controller.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize(['admin'])); // All report routes are admin only

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Analytics and sales reporting (Admin only)
 */

/**
 * @swagger
 * /api/reports/generate:
 *   post:
 *     summary: Generate a new analytics report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report generated successfully
 */
router.post("/generate", generateReport);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get all generated reports
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reports
 */
router.get("/", getReports);

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: Delete a report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report deleted
 */
router.delete("/:id", deleteReport);

export default router;
