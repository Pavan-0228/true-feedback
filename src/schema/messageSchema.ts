import { z } from "zod";

export const messageSchema = z.object({
    content: z
        .string()
        .min(10, { message: "Content at least contain 10 character " })
        .max(300,{ message: "Content not more than 300 character " } )
});
