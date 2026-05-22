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

/**
 * @swagger
 * /api/v1/transactions/purchase/{itemId}:
 *   post:
 *     summary: Purchase item
 *     description: Purchase an available marketplace item
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: number
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Item purchased successfully
 *       400:
 *         description: Invalid transaction request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 */
router.post(
  "/purchase/:itemId",
  authenticateUser,
  purchaseItemController,
);

/**
 * @swagger
 * /api/v1/transactions/my-purchases:
 *   get:
 *     summary: Get my purchases
 *     description: Fetch paginated purchases of logged in user
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         example: 1
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         example: 10
 *
 *     responses:
 *       200:
 *         description: Purchases fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/my-purchases",
  authenticateUser,
  getMyPurchasesController,
);

/**
 * @swagger
 * /api/v1/transactions/my-sales:
 *   get:
 *     summary: Get my sales
 *     description: Fetch paginated sales of logged in seller
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         example: 1
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         example: 10
 *
 *     responses:
 *       200:
 *         description: Sales fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/my-sales",
  authenticateUser,
  getMySalesController,
);

/**
 * @swagger
 * /api/v1/transactions:
 *   get:
 *     summary: Get all transactions
 *     description: Admin can fetch paginated marketplace transactions
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         example: 1
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         example: 10
 *
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */
router.get(
  "/",
  authenticateUser,
  authorizeRoles("admin"),
  getAllTransactionsController,
);

/**
 * @swagger
 * /api/v1/transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     description: Fetch single transaction details
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Transaction fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Transaction not found
 */
router.get(
  "/:id",
  authenticateUser,
  getTransactionByIdController,
);

export default router;