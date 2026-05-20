import { Request, Response } from "express";

import { createItemSchema } from "../validations/item.validation";

import { createItemService } from "../services/item.service";

export const createItemController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = createItemSchema.parse(req.body);

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });

      return;
    }

    await createItemService({
      ...validatedData,
      seller_id: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Item created successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
