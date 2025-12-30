import { Request, Response } from "express";
import { appointmentService } from "../services/appointment.service";

export const getAppointments = async (_: Request, res: Response) =>
  res.json(await appointmentService.getAll());

export const getAppointmentById = async (req: Request, res: Response) =>
  res.json(await appointmentService.getById(req.params.id));

export const createAppointment = async (req: Request, res: Response) =>
  res.status(201).json(await appointmentService.create(req.body));

export const updateAppointment = async (req: Request, res: Response) =>
  res.json(await appointmentService.update(req.params.id, req.body));

export const deleteAppointment = async (req: Request, res: Response) =>
  res.json(await appointmentService.remove(req.params.id));
