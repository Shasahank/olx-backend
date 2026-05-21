import { Router } from "express";

import { authenticateUser } from "../middlewares/auth.middleware";

import { purchaseItemController } from "../controllers/transaction.controller";

const router = Router();

router.post("/purchase/:itemId", authenticateUser, purchaseItemController);

export default router;
