import dbConnect from "@/db/db";
import { User } from "@/model/user.model";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, verifyCode } = await request.json();

    // console.log(username, " " ,verifyCode)


    const verifiedUser = await User.findOne(
      {
        username: username,
        isVerified: true
      }
    )

    if(verifiedUser){
      return Response.json({
        success: false,
        message: "User already verified!"
      }, {status: 403})
    }

    const userFetchFromUsername = await User.findOne({
      username: username,
    });

    if (!userFetchFromUsername) {
      return Response.json(
        {
          success: false,
          message: "Invalid Request || Error while fetching the username",
        },
        { status: 400 }
      );
    }

    const verifyCodeDB = userFetchFromUsername.verifyCode;

    const isVerifyCodeCorrect = verifyCode === verifyCodeDB;
    const isVerifyCodeValid =
      new Date(userFetchFromUsername.verifyCodeExpiry) > new Date();

    if (isVerifyCodeCorrect && isVerifyCodeValid) {

      userFetchFromUsername.isVerified = true;

      await userFetchFromUsername.save();

      return Response.json(
        {
          success: true,
          message: "User Verified successfully",
        },
        { status: 200 }
      );
    } else if (!isVerifyCodeCorrect && isVerifyCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Verification code is incorrect",
        },
        { status: 400 }
      );
    } else if (isVerifyCodeCorrect && !isVerifyCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Verification code has expired",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.log("Error occured while verifying the user", error.message);
    return Response.json(
      {
        success: false,
        message: "Error occured while verifying the user",
      },
      { status: 500 }
    );
  }
}
