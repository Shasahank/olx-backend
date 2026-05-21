import pool from "../database/db";

import { CreateTransactionInput } from "../interfaces/transaction.interface";

export const createTransaction = async (
  transactionData: CreateTransactionInput,
): Promise<any> => {
  const { buyer_id, seller_id, item_id, amount } = transactionData;

  const [result] = await pool.query(
    `
      INSERT INTO transactions
      (
        buyer_id,
        seller_id,
        item_id,
        amount
      )
      VALUES (?, ?, ?, ?)
    `,
    [buyer_id, seller_id, item_id, amount],
  );

  return result;
};

export const getMyPurchases = async (buyerId: number): Promise<any> => {
  const [rows] = await pool.query(
    `
      SELECT
        transactions.id,
        transactions.amount,
        transactions.status,
        transactions.created_at,

        items.id AS item_id,
        items.title,
        items.description,
        items.price,
        items.image_url,

        users.id AS seller_id,
        users.name AS seller_name,
        users.email AS seller_email

      FROM transactions

      INNER JOIN items
      ON transactions.item_id = items.id

      INNER JOIN users
      ON transactions.seller_id = users.id

      WHERE transactions.buyer_id = ?

      ORDER BY transactions.created_at DESC
    `,
    [buyerId],
  );

  return rows;
};

export const getMySales = async (sellerId: number): Promise<any> => {
  const [rows] = await pool.query(
    `
      SELECT
        transactions.id,
        transactions.amount,
        transactions.status,
        transactions.created_at,

        items.id AS item_id,
        items.title,
        items.description,
        items.price,
        items.image_url,

        users.id AS buyer_id,
        users.name AS buyer_name,
        users.email AS buyer_email

      FROM transactions

      INNER JOIN items
      ON transactions.item_id = items.id

      INNER JOIN users
      ON transactions.buyer_id = users.id

      WHERE transactions.seller_id = ?

      ORDER BY transactions.created_at DESC
    `,
    [sellerId],
  );

  return rows;
};

export const getAllTransactions = async (): Promise<any> => {
  const [rows] = await pool.query(
    `
      SELECT
        transactions.id,
        transactions.amount,
        transactions.status,
        transactions.created_at,

        items.id AS item_id,
        items.title,

        buyer.id AS buyer_id,
        buyer.name AS buyer_name,

        seller.id AS seller_id,
        seller.name AS seller_name

      FROM transactions

      INNER JOIN items
      ON transactions.item_id = items.id

      INNER JOIN users buyer
      ON transactions.buyer_id = buyer.id

      INNER JOIN users seller
      ON transactions.seller_id = seller.id

      ORDER BY transactions.created_at DESC
    `,
  );

  return rows;
};

export const getTransactionById = async (
  transactionId: number,
): Promise<any> => {
  const [rows]: any = await pool.query(
    `
      SELECT *
      FROM transactions
      WHERE id = ?
    `,
    [transactionId],
  );

  return rows[0];
};
