import { z } from "zod";

export const registrationSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    cpassword: z.string(),
  })
  .refine((data) => data.password === data.cpassword, {
    message: "Passwords don't match",
    path: ["cpassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
