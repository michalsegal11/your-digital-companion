import { Request, Response } from "express";
import { transactionService } from "../services/transaction.service";

export const getTransactions = async (_: Request, res: Response) =>
  res.json(await transactionService.getAll());

export const getTransactionById = async (req: Request, res: Response) =>
  res.json(await transactionService.getById(req.params.id));

export const createTransaction = async (req: Request, res: Response) =>
  res.status(201).json(await transactionService.create(req.body));

export const updateTransaction = async (req: Request, res: Response) =>
  res.json(await transactionService.update(req.params.id, req.body));

export const deleteTransaction = async (req: Request, res: Response) =>
  res.json(await transactionService.remove(req.params.id));
