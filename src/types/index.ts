import { z } from "zod";

export type AuthData = {
  username: string;
  password: string;
  confirmPassword?: string;
};

export type AuthDataType = {
  id: number;
  username: string;
  isAdmin: boolean;
  accessToken: string;
};

export const LoginSchema = z
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
    password: z
      .string({
        required_error: "Password is required",
      })
      .trim()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/^[a-z0-9-_]+$/i, {
        message: "Only use letters, numbers, dashes and underscores",
      }),
  })
  .strict();

export type LoginType = z.infer<typeof LoginSchema>;

export const SignupSchema = LoginSchema.extend({
  confirmPassword: z
    .string({
      required_error: "Password is required",
    })
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/^[a-z0-9-_]+$/i, {
      message: "Only use letters, numbers, dashes and underscores",
    }),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
    });
  }
});

export type SignupType = z.infer<typeof SignupSchema>;

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

export type BreakpointType = "xs" | "sm" | "md" | "lg" | "xl";
