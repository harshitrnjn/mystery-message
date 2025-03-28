import dbConnect from "@/db/db";
import { User } from "@/model/user.model";
import { getDataToken } from "@/utils/getDataToken";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const tokenId = getDataToken(request);

    console.log(tokenId);

    if (!tokenId) {
      return Response.json(
        {
          success: false,
          message: "User is not logged in",
        },
        { status: 403 }
      );
    }

    const { username } = await request.json();

    console.log(username);

    if (!username) {
      return Response.json(
        {
          success: false,
          message: "Username is required",
        },
        { status: 401 }
      );
    }

    // const userId = new mongoose.Types.ObjectId(tokenId);
    const user = await User.findOne({ username: username });

    // const user = await User.findById(userId);
    // console.log(user);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 }
      );
    }

    console.log("token id: ", tokenId, "USER ID: ", user._id);

    if (tokenId !== user._id.toString()) {
      return Response.json(
        {
          success: false,
          message: "You are not authorized to delete this user",
        },
        { status: 400 }
      );
    }

    const deleteUser = await User.findByIdAndDelete(user._id);

    if (deleteUser) {
      return Response.json(
        {
          success: true,
          message: "User deleted successfully",
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.log("ERROR WHILE DELETING USER: ", error);

    return Response.json(
      {
        success: false,
        message: "Error deleting user",
        error: error.response.data.message,
      },
      { status: 500 }
    );
  }
}
