import { Request, Response } from "express";

import { purchaseItemService } from "../services/transaction.service";

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
