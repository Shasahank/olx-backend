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


/*

http://localhost:5000/api/v1/items?page=3&limit=2
http://localhost:5000/api/v1/items?sort=price_asc
http://localhost:5000/api/v1/items?minPrice=10000&maxPrice=70000
http://localhost:5000/api/v1/items?search=iphone
http://localhost:5000/api/v1/items
*/