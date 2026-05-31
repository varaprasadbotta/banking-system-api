import { z } from "zod";

export const createAccountSchema = z.object({
  accountType: z.enum(["SAVINGS", "CURRENT", "SALARY"]),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
