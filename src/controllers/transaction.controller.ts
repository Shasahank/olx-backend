import { Request, Response } from "express";

import {
  getAllTransactionsService,
  getMyPurchasesService,
  getMySalesService,
  getTransactionByIdService,
  purchaseItemService,
} from "../services/transaction.service";

export const purchaseItemController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const itemId = Number(req.params.itemId);

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });

      return;
    }

    await purchaseItemService(itemId, req.user.id);

    res.status(200).json({
      success: true,
      message: "Item purchased successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const getMyPurchasesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const transactions = await getMyPurchasesService(req.user!.id);

    res.status(200).json({
      success: true,
      total: transactions.length,
      transactions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const getMySalesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const transactions = await getMySalesService(req.user!.id);

    res.status(200).json({
      success: true,
      total: transactions.length,
      transactions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const getAllTransactionsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const transactions = await getAllTransactionsService();

    res.status(200).json({
      success: true,
      total: transactions.length,
      transactions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const getTransactionByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const transactionId = Number(req.params.id);

    const transaction = await getTransactionByIdService(transactionId);

    if (!transaction) {
      res.status(404).json({
        success: false,
        message: "Transaction not found",
      });

      return;
    }

    const isOwner =
      transaction.buyer_id === req.user?.id ||
      transaction.seller_id === req.user?.id;

    const isAdmin = req.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: "Access denied",
      });

      return;
    }

    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
