import { z } from "zod";

export type CustomError = Error & {
  data?: string;
  status?: number;
  statusText?: string;
};

export type Product = {
  id?: number;
  title: string;
  price: number;
  brand: string;
};

export type ProductQuery = {
  method?: string;
  data: Product;
};

export const userSchema = z
  .object({
    username: z
      .string({
        required_error: "Username is required",
      })
      .trim()
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(20, { message: "Username max. 20 characters" })
      .regex(/^[a-z0-9-_]+$/i, {
        message: "Only use letters, numbers, dashes and underscores",
      }),
    email: z
      .string()
      .trim()
      .email({ message: "Please enter a valid email address" })
      // Accept empty string
      .or(z.string().length(0))
      .optional()
      // Return undefined in case of empty string
      .transform((val) => (val === "" ? undefined : val)),
  })
  .strict();

export type UserType = z.infer<typeof userSchema>;
