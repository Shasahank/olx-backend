import { Router } from "express";

import { authenticateUser } from "../middlewares/auth.middleware";

import { getProfileController } from "../controllers/user.controller";

const router = Router();

router.get("/profile", authenticateUser, getProfileController);

export default router;
