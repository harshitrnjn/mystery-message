import dbConnect from "@/db/db";
import { User } from "@/model/user.model";
import { sendEmail } from "@/utils/mailer";
import { sendVerificationEamil } from "@/utils/sendVerificationEmail";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { fullName, username, email, password } = await request.json();

    if (!fullName || !username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Either of the field is missing",
        },
        { status: 400 }
      );
    }

    const existingVerifiedUserByUsername = await User.findOne({
      username: username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists and is verified",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await User.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const verifyCodeExpiry = new Date();
      verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

      const user = await User.create({
        fullName: fullName,
        username: username,
        email: email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: verifyCodeExpiry,
        messages: [],
      });

      if (!user) {
        return Response.json(
          {
            success: false,
            message: "Error while registering the user",
          },
          { status: 400 }
        );
      }
    }

    const emailResponse = await sendEmail({email, emailType: "VERIFY", username, otp: verifyCode });

    // console.log(emailResponse);

    if (!emailResponse) {
      return Response.json(
        {
          success: false,
          message: "Error while sending Verification Email",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User Registered successfully, now Verify your email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Invalid request", success: false },
      { status: 500 }
    );
  }
}
