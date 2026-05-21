import { Router } from "express";

import { authenticateUser } from "../middlewares/auth.middleware";

import { authorizeRoles } from "../middlewares/role.middleware";

import {
  getAllTransactionsController,
  getMyPurchasesController,
  getMySalesController,
  getTransactionByIdController,
  purchaseItemController,
} from "../controllers/transaction.controller";

const router = Router();

router.post("/purchase/:itemId", authenticateUser, purchaseItemController);

router.get("/my-purchases", authenticateUser, getMyPurchasesController);

router.get("/my-sales", authenticateUser, getMySalesController);

router.get(
  "/",
  authenticateUser,
  authorizeRoles("admin"),
  getAllTransactionsController,
);

router.get("/:id", authenticateUser, getTransactionByIdController);

export default router;
