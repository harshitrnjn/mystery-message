import { resend } from "@/utils/resend"
import VerificationEmail from "@/Email Template/emailTemplate"
import { NextResponse } from "next/server"

export async function sendVerificationEamil( 
    email: string,
    username: string,
    verifyCode: string,
 ){
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystry || Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
          });

        return NextResponse.json({ message: "Verification email sent successfully!", success: true }, {status: 200})

    } catch (error) {
        console.log("Error sending email", error)
        return NextResponse.json({ message: "Error sending email", success: false }, {status: 500})
    }
 }