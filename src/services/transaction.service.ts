import {
  createTransaction,
  getAllTransactions,
  getMyPurchases,
  getMySales,
  getTransactionById,
} from "../repositories/transaction.repository";

import { getItemById, markItemAsSold } from "../repositories/item.repository";

import AppError from "../utils/appError";

import { ITEM_STATUS } from "../constants/item";

import { MESSAGES } from "../constants/messages";

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

  await createTransaction({
    buyer_id: buyerId,
    seller_id: item.seller_id,
    item_id: item.id,
    amount: item.price,
  });

  await markItemAsSold(item.id);
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
