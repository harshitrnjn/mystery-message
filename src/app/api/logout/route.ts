import dbConnect from "@/db/db";
import { User } from "@/model/user.model";
import { getDataToken } from "@/utils/getDataToken";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const tokenId = await getDataToken(request);

    if (!tokenId) {
      return Response.json(
        {
          success: false,
          message: "Token is required",
        },
        { status: 401 }
      );
    }

    const id = new mongoose.Types.ObjectId(tokenId);

    const user = await User.findById(id);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    if (tokenId !== user._id.toString()) {
      return Response.json(
        {
          success: false,
          message: "Something went wrong!",
        },
        { status: 400 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        message: "User logged out successfully",
      },
      { status: 200 }
    );

    response.cookies.set("token", "");

    return response;
  } catch (error: any) {
    console.log("ERROR WHILE LOG-OUT: ", error);

    return Response.json(
      {
        success: false,
        message: "Error while logging out",
      },
      { status: 500 }
    );
  }
}
