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

export const editPostSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required " })
    .max(50, { message: "Title cannot be longer than 50 characters" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(1000, {
      message: "Description cannot be longer than 1000 characters",
    }),
});
