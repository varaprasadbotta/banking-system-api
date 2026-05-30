import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),

  email: z.email(),

  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({
  email: z.email(),

  password: z.string().min(1),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;
