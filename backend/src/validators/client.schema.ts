import { z } from "zod";

export const createClientSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  notes: z.string().optional(),
  preferredContactMethod: z.enum(["PHONE", "EMAIL", "NONE"]).optional()
});
