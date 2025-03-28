import {z} from "zod";

export const acceptingMessageSchema = z.object({
    isAccepting: z.boolean(),
})