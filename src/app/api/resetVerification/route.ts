import dbConnect from "@/db/db";
import { User } from "@/model/user.model";
import { getDataToken } from "@/utils/getDataToken";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function GET( request : NextRequest ){

    const token = await getDataToken(request)

    if(!token){
        return NextResponse.json({
            success: false,
            message: "Unauthorized Request"
        }, { status: 401 })
    }

    try {
        await dbConnect()

        const userId = await User.findById(new mongoose.Types.ObjectId(token))

        if(!userId){
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        const resetOtp = await User.updateOne( userId, {
            verifyOtp: ""
        }, { new:true } )

        if(!resetOtp){
            return NextResponse.json({
                success: false,
                message: "Unable to reset otp field"
            }, { status: 400 } )
        }

        return NextResponse.json({
            success: true,
            message: "OTP field reset successfully"
        }, { status: 200 })
        
    } catch (error:any) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        }, { status: 500 })
    }

}
