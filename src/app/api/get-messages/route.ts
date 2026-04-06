import dbConnect from "@/db/db";
import { User } from "@/model/user.model";
import { getDataToken } from "@/utils/getDataToken";
import mongoose from "mongoose";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest){
    await dbConnect();

    try {

        const tokenId = await getDataToken(request);

        if(!tokenId){
            return Response.json({
                success: false,
                message: "Token is required || User must login",
            }, {status: 401})
        }

        const id = new mongoose.Types.ObjectId(tokenId)

        const user = await User.findById(id)
        
        if(!user){
            return Response.json({
                success: false,
                message: "User not registered || User not found"
            }, {status: 401})
        }

        if(tokenId !== user._id.toString()){
            return Response.json({
                success: false,
                message: "User is not authorized"
            }, {status: 400})
        }

        return Response.json({
            success: true,
            message: "User found",
            user: user
        }, {status: 200})
        
    } catch (error: any) {
        console.log("ERROR WHILE FETCHING MESSAGES: ", error)

        return Response.json({
            success: false,
            message: "Error fetching messages",
        }, {status: 500})

    }

}
