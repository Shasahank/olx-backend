import { Request, Response } from "express";

import asyncHandler from "../utils/asyncHandler";

import AppError from "../utils/appError";

import {
  createItemSchema,
  updateItemSchema,
} from "../validations/item.validation";

import {
  createItemService,
  deleteItemService,
  getAllItemsService,
  getItemByIdService,
  updateItemService,
} from "../services/item.service";

export const createItemController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validatedData = createItemSchema.parse(req.body);

    if (!req.user) {
      throw new AppError("Unauthorized access", 401);
    }

    await createItemService({
      ...validatedData,
      seller_id: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Item created successfully",
    });
  },
);

export const getAllItemsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const role = req.user?.role;

    const search = (req.query.search as string) || "";

    const minPrice = Number(req.query.minPrice) || 0;

    const maxPrice = Number(req.query.maxPrice) || 0;

    const sort = (req.query.sort as string) || "";

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const items = await getAllItemsService(
      role,
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
  },
);

export const getSingleItemController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const itemId = Number(req.params.id);

    const item = await getItemByIdService(itemId);

    if (!item) {
      throw new AppError("Item not found", 404);
    }

    res.status(200).json({
      success: true,
      item,
    });
  },
);

export const updateItemController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const itemId = Number(req.params.id);

    if ("status" in req.body) {
      throw new AppError("Item status cannot be updated manually", 400);
    }

    const validatedData = updateItemSchema.parse(req.body);

    if (Object.keys(validatedData).length === 0) {
      throw new AppError("At least one field is required for update", 400);
    }

    const item = await getItemByIdService(itemId);

    if (!item) {
      throw new AppError("Item not found", 404);
    }

    if (item.seller_id !== req.user?.id && req.user?.role !== "admin") {
      throw new AppError("Access denied", 403);
    }

    await updateItemService(itemId, validatedData);

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
    });
  },
);

export const deleteItemController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const itemId = Number(req.params.id);

    const item = await getItemByIdService(itemId);

    if (!item) {
      throw new AppError("Item not found", 404);
    }

    if (item.seller_id !== req.user?.id && req.user?.role !== "admin") {
      throw new AppError("Access denied", 403);
    }

    await deleteItemService(itemId);

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  },
);
