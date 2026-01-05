import { Request, Response } from "express";
import { clientService } from "../services/client.service";

export const getClients = async (_req: Request, res: Response) =>
  res.json(await clientService.getAll());

export const getClientById = async (req: Request, res: Response) =>
  res.json(await clientService.getById(req.params.id));

export const createClient = async (req: Request, res: Response) =>
  res.status(201).json(await clientService.create(req.body));

export const updateClient = async (req: Request, res: Response) =>
  res.json(await clientService.update(req.params.id, req.body));

export const deleteClient = async (req: Request, res: Response) =>
  res.json(await clientService.remove(req.params.id));
