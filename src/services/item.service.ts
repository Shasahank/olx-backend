import { CreateItemInput } from "../interfaces/item.interface";

import { createItem, getAllItems } from "../repositories/item.repository";

export const createItemService = async (
  itemData: CreateItemInput,
): Promise<void> => {
  await createItem(itemData);
};

export const getAllItemsService = async (
  search: string,
  minPrice: number,
  maxPrice: number,
  sort: string,
  page: number,
  limit: number,
): Promise<any> => {
  return await getAllItems(search, minPrice, maxPrice, sort, page, limit);
};
