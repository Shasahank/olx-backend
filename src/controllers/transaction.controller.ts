import { Request, Response } from "express";

import asyncHandler from "../utils/asyncHandler";

import AppError from "../utils/appError";

import {
  getAllTransactionsService,
  getMyPurchasesService,
  getMySalesService,
  getTransactionByIdService,
  purchaseItemService,
} from "../services/transaction.service";

export const purchaseItemController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const itemId = Number(req.params.itemId);

    if (!req.user) {
      throw new AppError("Unauthorized access", 401);
    }

    await purchaseItemService(itemId, req.user.id);

    res.status(200).json({
      success: true,
      message: "Item purchased successfully",
    });
  },
);

export const getMyPurchasesController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const transactions = await getMyPurchasesService(req.user!.id);

    res.status(200).json({
      success: true,
      total: transactions.length,
      transactions,
    });
  },
);

export const getMySalesController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const transactions = await getMySalesService(req.user!.id);

    res.status(200).json({
      success: true,
      total: transactions.length,
      transactions,
    });
  },
);

export const getAllTransactionsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const transactions = await getAllTransactionsService();

    res.status(200).json({
      success: true,
      total: transactions.length,
      transactions,
    });
  },
);

export const getTransactionByIdController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const transactionId = Number(req.params.id);

    const transaction = await getTransactionByIdService(transactionId);

    if (!transaction) {
      throw new AppError("Transaction not found", 404);
    }

    const isOwner =
      transaction.buyer_id === req.user?.id ||
      transaction.seller_id === req.user?.id;

    const isAdmin = req.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new AppError("Access denied", 403);
    }

    res.status(200).json({
      success: true,
      transaction,
    });
  },
);
