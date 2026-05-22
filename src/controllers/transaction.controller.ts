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

import { ROLES } from "../constants/roles";

import { MESSAGES } from "../constants/messages";

export const purchaseItemController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const itemId = Number(req.params.itemId);

    if (!req.user) {
      throw new AppError(MESSAGES.UNAUTHORIZED, 401);
    }

    await purchaseItemService(itemId, req.user.id);

    res.status(200).json({
      success: true,
      message: MESSAGES.ITEM_PURCHASED,
    });
  },
);

export const getMyPurchasesController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const result = await getMyPurchasesService(req.user!.id, page, limit);

    res.status(200).json({
      success: true,

      page,

      limit,

      totalItems: result.total,

      totalPages: Math.ceil(result.total / limit),

      transactions: result.transactions,
    });
  },
);

export const getMySalesController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const result = await getMySalesService(req.user!.id, page, limit);

    res.status(200).json({
      success: true,

      page,

      limit,

      totalItems: result.total,

      totalPages: Math.ceil(result.total / limit),

      transactions: result.transactions,
    });
  },
);

export const getAllTransactionsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const result = await getAllTransactionsService(page, limit);

    res.status(200).json({
      success: true,

      page,

      limit,

      totalItems: result.total,

      totalPages: Math.ceil(result.total / limit),

      transactions: result.transactions,
    });
  },
);

export const getTransactionByIdController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const transactionId = Number(req.params.id);

    const transaction = await getTransactionByIdService(transactionId);

    if (!transaction) {
      throw new AppError(MESSAGES.TRANSACTION_NOT_FOUND, 404);
    }

    const isOwner =
      transaction.buyer_id === req.user?.id ||
      transaction.seller_id === req.user?.id;

    const isAdmin = req.user?.role === ROLES.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new AppError(MESSAGES.ACCESS_DENIED, 403);
    }

    res.status(200).json({
      success: true,
      transaction,
    });
  },
);
