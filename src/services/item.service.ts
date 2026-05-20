import { CreateItemInput } from "../interfaces/item.interface";

import { createItem } from "../repositories/item.repository";

export const createItemService = async (
  itemData: CreateItemInput,
): Promise<void> => {
  await createItem(itemData);
};
