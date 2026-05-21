import { Router } from "express";

import { authenticateUser } from "../middlewares/auth.middleware";

import { getProfileController } from "../controllers/user.controller";

const router = Router();

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Fetch logged in user profile details
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authenticateUser, getProfileController);

export default router;
