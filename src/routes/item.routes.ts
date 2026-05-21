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

/**
 * @swagger
 * /api/v1/items:
 *   post:
 *     summary: Create item
 *     description: Create a new marketplace item
 *     tags:
 *       - Items
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: iPhone 14
 *               description:
 *                 type: string
 *                 example: Brand new iPhone 14 for sale
 *               price:
 *                 type: number
 *                 example: 65000
 *               image_url:
 *                 type: string
 *                 example: https://example.com/iphone.jpg
 *     responses:
 *       201:
 *         description: Item created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticateUser, createItemController);

/**
 * @swagger
 * /api/v1/items:
 *   get:
 *     summary: Get all items
 *     description: Fetch marketplace items with search, filter, sorting and pagination
 *     tags:
 *       - Items
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: iphone
 *
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         example: 10000
 *
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         example: 70000
 *
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         example: price_asc
 *
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
 *         description: Items fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticateUser, getAllItemsController);

/**
 * @swagger
 * /api/v1/items/{id}:
 *   get:
 *     summary: Get single item
 *     description: Fetch single marketplace item details
 *     tags:
 *       - Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         example: 1
 *     responses:
 *       200:
 *         description: Item fetched successfully
 *       404:
 *         description: Item not found
 */
router.get("/:id", getSingleItemController);

/**
 * @swagger
 * /api/v1/items/{id}:
 *   put:
 *     summary: Update item
 *     description: Update marketplace item
 *     tags:
 *       - Items
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         example: 1
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated iPhone 14
 *               description:
 *                 type: string
 *                 example: Updated description
 *               price:
 *                 type: number
 *                 example: 70000
 *               image_url:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Item not found
 */
router.put("/:id", authenticateUser, updateItemController);

/**
 * @swagger
 * /api/v1/items/{id}:
 *   delete:
 *     summary: Delete item
 *     description: Delete marketplace item
 *     tags:
 *       - Items
 *     security:
 *       - bearerAuth: []
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
 *         description: Item deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Item not found
 */
router.delete("/:id", authenticateUser, deleteItemController);

export default router;
