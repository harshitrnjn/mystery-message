import dbConnect from "@/db/db";
import { User } from "@/model/user.model";
import { getDataToken } from "@/utils/getDataToken";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {

  const tokenId = getDataToken(request);

  console.log(tokenId)

  if (!tokenId) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized Request || Token is required",
      },
      { status: 401 }
    );
  }

  await dbConnect();

  try {

    const { status }: { status: boolean } = await request.json()

    const userId = new mongoose.Types.ObjectId(tokenId);

    //continue with user search and update the isVerified

    const userUpdated = await User.findByIdAndUpdate(userId, {
      $set: { isAcceptingMessages: status },
    }, {new: true});

    if (!userUpdated) {
        return Response.json({
            success: false,
            message: "User does not exists",
        }, {status: 400})
    }

    return Response.json({
        success: true,
        message: "Message status updated successfully",
        user: userUpdated
    }, {status: 200})

  } catch (error: any) {
    console.log("ERROR IN CHANGING THE MESSAGE STATUS: ", error);

    return Response.json(
      {
        success: false,
        message: "Error in changing the message status",
      },
      { status: 500 }
    );
  }
}
