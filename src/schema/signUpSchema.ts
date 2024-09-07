import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(3, "Username must be at least 3  character ")
    .max(20, "Username is not more than 20 character")
    .regex(/^[a-z0-9_-]{3,15}$/, "username must not contain special character");

export const signUpSchemaValidation = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Enter valid email address" }),
    password: z
        .string()
        .min(6, { message: "password should be min 6 character" })
        .max(12, { message: "password not contain more than 20 character" }),
});
