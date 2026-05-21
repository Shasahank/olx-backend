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

export const getAllItems = async (
  role: string | undefined,
  search: string,
  minPrice: number,
  maxPrice: number,
  sort: string,
  page: number,
  limit: number,
): Promise<any> => {
  const offset = (page - 1) * limit;

  let query = `
    SELECT
      items.id,
      items.title,
      items.description,
      items.price,
      items.image_url,
      items.status,
      items.created_at,

      users.id AS seller_id,
      users.name AS seller_name,
      users.email AS seller_email

    FROM items

    INNER JOIN users
    ON items.seller_id = users.id

    WHERE 1 = 1
  `;

  const queryParams: any[] = [];

  if (role !== "admin") {
    query += ` AND items.status = 'available' `;
  }

  if (search) {
    query += ` AND items.title LIKE ? `;
    queryParams.push(`%${search}%`);
  }

  if (minPrice) {
    query += ` AND items.price >= ? `;
    queryParams.push(minPrice);
  }

  if (maxPrice) {
    query += ` AND items.price <= ? `;
    queryParams.push(maxPrice);
  }

  if (sort === "price_asc") {
    query += ` ORDER BY items.price ASC `;
  } else if (sort === "price_desc") {
    query += ` ORDER BY items.price DESC `;
  } else {
    query += ` ORDER BY items.created_at DESC `;
  }

  query += ` LIMIT ? OFFSET ? `;

  queryParams.push(limit, offset);

  const [rows] = await pool.query(query, queryParams);

  return rows;
};

export const getItemById = async (itemId: number): Promise<any> => {
  const [rows]: any = await pool.query(
    `
      SELECT *
      FROM items
      WHERE id = ?
    `,
    [itemId],
  );

  return rows[0];
};

export const updateItem = async (
  itemId: number,
  updateData: any,
): Promise<any> => {
  const fields = Object.keys(updateData);

  const values = Object.values(updateData);

  const setClause = fields.map((field) => `${field} = ?`).join(", ");

  const query = `
    UPDATE items
    SET ${setClause}
    WHERE id = ?
  `;

  values.push(itemId);

  const [result] = await pool.query(query, values);

  return result;
};

export const deleteItem = async (itemId: number): Promise<any> => {
  const [result] = await pool.query(
    `
      DELETE FROM items
      WHERE id = ?
    `,
    [itemId],
  );

  return result;
};

export const markItemAsSold = async (itemId: number): Promise<any> => {
  const [result] = await pool.query(
    `
      UPDATE items
      SET status = 'sold'
      WHERE id = ?
    `,
    [itemId],
  );

  return result;
};
