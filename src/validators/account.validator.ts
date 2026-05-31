import { z } from "zod";

export const createAccountSchema = z.object({
  accountType: z.enum(["SAVINGS", "CURRENT", "SALARY"]),
});

export const depositSchema = z.object({
  amount: z.number().positive(),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type DepositInput = z.infer<typeof depositSchema>;
