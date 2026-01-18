import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { getDashboardStats } from "../controllers/report.controller.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize(['admin']));

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Admin dashboard statistics
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 */
router.get("/stats", getDashboardStats);

export default router;
