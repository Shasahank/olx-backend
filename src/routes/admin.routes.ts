import { Router } from "express";

import { adminDashboardController } from "../controllers/admin.controller";

import { authenticateUser } from "../middlewares/auth.middleware";

import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.get(
  "/dashboard",
  authenticateUser,
  authorizeRoles("admin"),
  adminDashboardController,
);

export default router;
