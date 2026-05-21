import { createTransaction } from "../repositories/transaction.repository";

import { getItemById, markItemAsSold } from "../repositories/item.repository";

export const purchaseItemService = async (
  itemId: number,
  buyerId: number,
): Promise<void> => {
  const item = await getItemById(itemId);

  if (!item) {
    throw new Error("Item not found");
  }

  if (item.status === "sold") {
    throw new Error("Item already sold");
  }

  if (item.seller_id === buyerId) {
    throw new Error("You cannot purchase your own item");
  }

  await createTransaction({
    buyer_id: buyerId,
    seller_id: item.seller_id,
    item_id: item.id,
    amount: item.price,
  });

  await markItemAsSold(item.id);
};
