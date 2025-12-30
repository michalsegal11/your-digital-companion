import { Request, Response } from "express";
import { wigPurchaseService } from "../services/wigPurchase.service";

export const getWigPurchases = async (_: Request, res: Response) =>
  res.json(await wigPurchaseService.getAll());

export const getWigPurchase = async (req: Request, res: Response) =>
  res.json(await wigPurchaseService.getById(req.params.id));

export const createWigPurchase = async (req: Request, res: Response) =>
  res.status(201).json(await wigPurchaseService.create(req.body));
