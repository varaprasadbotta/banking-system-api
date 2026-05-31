import z from "zod";

export const transferSchema = z.object({
  fromAccountNumber: z.string().min(1),

  toAccountNumber: z.string().min(1),

  amount: z.number().positive(),
});
