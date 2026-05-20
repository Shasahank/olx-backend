import { Router } from "express";

import { authenticateUser } from "../middlewares/auth.middleware";

import {
  createItemController,
  deleteItemController,
  getAllItemsController,
  getSingleItemController,
  updateItemController,
} from "../controllers/item.controller";

const router = Router();

router.post("/", authenticateUser, createItemController);

// NOW PROTECTED FOR ROLE-BASED VISIBILITY
router.get("/", authenticateUser, getAllItemsController);

router.get("/:id", getSingleItemController);

router.put("/:id", authenticateUser, updateItemController);

router.delete("/:id", authenticateUser, deleteItemController);

export default router;
