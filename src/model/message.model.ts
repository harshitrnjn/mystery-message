import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  content: string;
}

export const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Message = mongoose.models?.Message || mongoose.model("Message", messageSchema)
