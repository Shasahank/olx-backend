import { Router } from "express";

import { authenticateUser } from "../middlewares/auth.middleware";

import { createItemController } from "../controllers/item.controller";

const router = Router();

router.post("/", authenticateUser, createItemController);

export default router;
