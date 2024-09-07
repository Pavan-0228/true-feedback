import { z } from "zod";

export const signInScheme = z.object({
    identifier: z.string(),
    password: z.string(),

})