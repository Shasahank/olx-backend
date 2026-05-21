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

/*

CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,

    buyer_id INT NOT NULL,

    seller_id INT NOT NULL,

    item_id INT NOT NULL,

    amount DECIMAL(10, 2) NOT NULL,

    status ENUM(
        'pending',
        'completed',
        'cancelled'
    ) DEFAULT 'completed',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (buyer_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    FOREIGN KEY (seller_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    FOREIGN KEY (item_id)
    REFERENCES items(id)
    ON DELETE CASCADE
);

CREATE INDEX idx_transactions_buyer
ON transactions(buyer_id);

CREATE INDEX idx_transactions_seller
ON transactions(seller_id);

CREATE INDEX idx_transactions_item
ON transactions(item_id);

*/ 