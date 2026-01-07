import { z } from "zod";

export const createServiceVisitSchema = z.object({
  appointmentId: z.string(),
  wigPurchaseId: z.string().optional(),
  visitDate: z.string(),
  serviceName: z.string(),
  isFree: z.boolean().optional(),
  freeReason: z.string().optional(),
  priceCharged: z.number(),
  internalCost: z.number(),
  notes: z.string().optional()
});
