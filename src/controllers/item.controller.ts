import { Request, Response } from "express";

import { ZodError } from "zod";

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
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: error.issues[0].message,
      });

      return;
    }

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const getSingleItemController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const itemId = Number(req.params.id);

    const item = await getItemByIdService(itemId);

    if (!item) {
      res.status(404).json({
        success: false,
        message: "Item not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const updateItemController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const itemId = Number(req.params.id);

    const validatedData = updateItemSchema.parse(req.body);

    const item = await getItemByIdService(itemId);

    if (!item) {
      res.status(404).json({
        success: false,
        message: "Item not found",
      });

      return;
    }

    if (item.seller_id !== req.user?.id && req.user?.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Access denied",
      });

      return;
    }

    await updateItemService(itemId, validatedData);

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: error.issues[0].message,
      });

      return;
    }

    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const deleteItemController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const itemId = Number(req.params.id);

    const item = await getItemByIdService(itemId);

    if (!item) {
      res.status(404).json({
        success: false,
        message: "Item not found",
      });

      return;
    }

    if (item.seller_id !== req.user?.id && req.user?.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Access denied",
      });

      return;
    }

    await deleteItemService(itemId);

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
