import { z } from "zod";

export const createWigPurchaseSchema = z.object({
  clientId: z.string(),
  purchaseDate: z.string(),
  wigDescription: z.string(),
  price: z.number(),
});
