import dbConnect from "@/db/db";
import { User } from "@/model/user.model";
import { getDataToken } from "@/utils/getDataToken";
import mongoose from "mongoose";
import { NextRequest } from "next/server";



export async function GET( request: NextRequest ){

    await dbConnect();

    try {

        const tokenId = getDataToken(request);

        if(!tokenId){
            return Response.json({
                success: false,
                message: "UNAUTHORIZED REQUEST || TOKEN IS NOT PRESENT || LOGIN REQUIRED"
            }, {status: 401})
        }

        const userId = new mongoose.Types.ObjectId(tokenId)

        const user = await User.findById(userId).select("-password")

        if(!user){
            return Response.json({
                success: false,
                message: "User does not exists"
            }, {status: 400}) 
        }

        return Response.json({
            success: true,
            message: "User fetched successfully",
            user: user
        }, {status: 200})
        
    } catch (error: any) {
        console.log("ERROR FETCHING THE USER", error)

        return Response.json({
            success: false,
            message: "Error fetching the user",
            error: error.response.data.message || "Error"
        }, {status: 500})

    }

}
