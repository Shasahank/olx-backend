import {
  getAllTransactions,
  getMyPurchases,
  getMySales,
  getTransactionById,
} from "../repositories/transaction.repository";

import { getItemById } from "../repositories/item.repository";

import AppError from "../utils/appError";

import { ITEM_STATUS } from "../constants/item";

import { MESSAGES } from "../constants/messages";

import pool from "../database/db";

export const purchaseItemService = async (
  itemId: number,
  buyerId: number,
): Promise<void> => {
  const item: any = await getItemById(itemId);

  if (!item) {
    throw new AppError(MESSAGES.ITEM_NOT_FOUND, 404);
  }

  if (item.status === ITEM_STATUS.SOLD) {
    throw new AppError(MESSAGES.ITEM_ALREADY_SOLD, 400);
  }

  if (item.seller_id === buyerId) {
    throw new AppError(MESSAGES.CANNOT_BUY_OWN_ITEM, 400);
  }

  const connection = await pool.getConnection();

  try {
    // START TRANSACTION
    await connection.beginTransaction();

    // CREATE TRANSACTION
    await connection.query(
      `
        INSERT INTO transactions (
          buyer_id,
          seller_id,
          item_id,
          amount
        )
        VALUES (?, ?, ?, ?)
      `,
      [buyerId, item.seller_id, item.id, item.price],
    );

    // MARK ITEM AS SOLD
    await connection.query(
      `
        UPDATE items
        SET status = ?
        WHERE id = ?
      `,
      [ITEM_STATUS.SOLD, item.id],
    );

    // COMMIT
    await connection.commit();
  } catch (error) {
    // ROLLBACK IF ANYTHING FAILS
    await connection.rollback();

    throw error;
  } finally {
    // RELEASE CONNECTION
    connection.release();
  }
};

export const getMyPurchasesService = async (buyerId: number): Promise<any> => {
  return await getMyPurchases(buyerId);
};

export const getMySalesService = async (sellerId: number): Promise<any> => {
  return await getMySales(sellerId);
};

export const getAllTransactionsService = async (): Promise<any> => {
  return await getAllTransactions();
};

export const getTransactionByIdService = async (
  transactionId: number,
): Promise<any> => {
  return await getTransactionById(transactionId);
};
