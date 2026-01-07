import { z } from "zod";

export const createTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number(),
  transactionDate: z.string(),
  clientId: z.string().optional(),
  serviceVisitId: z.string().optional(),
  wigPurchaseId: z.string().optional(),
  category: z.string(),
  description: z.string().optional()
});
