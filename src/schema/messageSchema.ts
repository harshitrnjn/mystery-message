import {z} from "zod";

export const messageSchema = z.object({
    content: z.string().min(10, {message: "Message should contain 10 letters"}).max(200, {message: "Message should not exceed 200 letters!"})
})