import { Router } from "express";

import { adminDashboardController } from "../controllers/admin.controller";

import { authenticateUser } from "../middlewares/auth.middleware";

import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Admin dashboard
 *     description: Get complete admin dashboard data
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */
router.get(
  "/dashboard",
  authenticateUser,
  authorizeRoles("admin"),
  adminDashboardController,
);

export default router;
