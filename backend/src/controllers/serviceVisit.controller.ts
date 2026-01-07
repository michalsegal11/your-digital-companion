import { Request, Response } from "express";
import { serviceVisitService } from "../services/serviceVisit.service";

export const getServiceVisits = async (_: Request, res: Response) =>
  res.json(await serviceVisitService.getAll());

export const getServiceVisitById = async (req: Request, res: Response) =>
  res.json(await serviceVisitService.getById(req.params.id));

export const createServiceVisit = async (req: Request, res: Response) =>
  res.status(201).json(await serviceVisitService.create(req.body));

export const updateServiceVisit = async (req: Request, res: Response) =>
  res.json(await serviceVisitService.update(req.params.id, req.body));

export const deleteServiceVisit = async (req: Request, res: Response) =>
  res.json(await serviceVisitService.remove(req.params.id));
