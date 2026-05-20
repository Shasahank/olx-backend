import { CreateItemInput } from "../interfaces/item.interface";

import {
  createItem,
  deleteItem,
  getAllItems,
  getItemById,
  updateItem,
} from "../repositories/item.repository";

export const createItemService = async (
  itemData: CreateItemInput,
): Promise<void> => {
  await createItem(itemData);
};

export const getAllItemsService = async (
  role: string | undefined,
  search: string,
  minPrice: number,
  maxPrice: number,
  sort: string,
  page: number,
  limit: number,
): Promise<any> => {
  return await getAllItems(role, search, minPrice, maxPrice, sort, page, limit);
};

export const getItemByIdService = async (itemId: number): Promise<any> => {
  return await getItemById(itemId);
};

export const updateItemService = async (
  itemId: number,
  updateData: any,
): Promise<any> => {
  return await updateItem(itemId, updateData);
};

export const deleteItemService = async (itemId: number): Promise<any> => {
  return await deleteItem(itemId);
};
