import mongoose, { Schema, Document } from "mongoose";
import { IMessage, Message, messageSchema } from "@/model/message.model";

export interface IUser extends Document{
    fullName: string;
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isAcceptingMessages: boolean;
    isVerified: boolean;
    messages: IMessage[];
}

const userSchema = new mongoose.Schema<IUser>(
    {
        fullName: { 
            type: String, required: true 
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, "Please enter valid email address"]
        },
        password: {
            type: String,
            required: true,
        },
        verifyCode: {
            type: String,
        },
        verifyCodeExpiry: {
            type: Date
        },
        isAcceptingMessages: {
            type: Boolean,
            default: true,
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        messages: [messageSchema]

    }
    ,{timestamps: true})

export const User = mongoose.models?.User || mongoose.model("User", userSchema)