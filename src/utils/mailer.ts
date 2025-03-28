import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const sendEmail = async ({ email, emailType, username, otp }: any) => {
  try {


    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "66e1fe59e9de03",
        pass: "f4a40555993913",
      },
    });

    const mailOptions = {
      from: "themalhotras2380@gmail.com", // sender address
      to: email, // list of receivers
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
      // text: emailType === "VERIFY" ? "Verification Email" : "", // plain text body
      html: ` <div> <h1>Here&apos;s your verification code: ${otp}</h1> <br/> <h1>Heelo ${username}, here is your otp: ${otp}</h1>  </div> `,
    };

    const response = await transport.sendMail(mailOptions);

    return response;


  } catch (error: any) {
    return NextResponse.json({
      message: "Error in sending mail",
    });
  }
};
