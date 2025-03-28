import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(20, "Username must be atmost 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username should not contain special character")


export const signupSchema = z.object({
    fullName: z.string(),
    username: usernameValidation,
    email: z.string().email({message: "Invalid Email address"}),
    password: z.string().min(6, "Password must contain 6 characters").max(12, "Password should not exeed 12 characters"),
})