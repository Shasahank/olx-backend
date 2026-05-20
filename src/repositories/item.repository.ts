import pool from "../database/db";

import { CreateItemInput } from "../interfaces/item.interface";

export const createItem = async (itemData: CreateItemInput): Promise<any> => {
  const { title, description, price, image_url, seller_id } = itemData;

  const [result] = await pool.query(
    `
      INSERT INTO items
      (title, description, price, image_url, seller_id)
      VALUES (?, ?, ?, ?, ?)
    `,
    [title, description, price, image_url || null, seller_id],
  );

  return result;
};
