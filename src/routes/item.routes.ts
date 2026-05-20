import { Router } from "express";

import { authenticateUser } from "../middlewares/auth.middleware";

import {
  createItemController,
  getAllItemsController,
} from "../controllers/item.controller";

const router = Router();

router.post("/", authenticateUser, createItemController);

router.get("/", getAllItemsController);

export default router;
