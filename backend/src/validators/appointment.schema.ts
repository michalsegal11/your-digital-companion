import { z } from "zod";

export const createAppointmentSchema = z.object({
  clientId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELED", "NO_SHOW"]).optional(),
  source: z.enum(["APP", "PHONE", "MANUAL"]),
  serviceName: z.string(),
  wigPurchaseId: z.string().optional(),
  notes: z.string().optional()
});
