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
