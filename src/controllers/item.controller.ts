import { Request, Response } from "express";

import { createItemSchema } from "../validations/item.validation";

import {
  createItemService,
  getAllItemsService,
} from "../services/item.service";

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

export const getAllItemsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const search = (req.query.search as string) || "";

    const minPrice = Number(req.query.minPrice) || 0;

    const maxPrice = Number(req.query.maxPrice) || 0;

    const sort = (req.query.sort as string) || "";

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const items = await getAllItemsService(
      search,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
    );

    res.status(200).json({
      success: true,
      total: items.length,
      page,
      limit,
      items,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
