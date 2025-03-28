import dbConnect from "@/db/db";
import { User } from "@/model/user.model";
import { getDataToken } from "@/utils/getDataToken";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest){
    await dbConnect();

    try {

        const tokenId = getDataToken(request)

        if(!tokenId){
            return Response.json({
                success: false,
                message: "Token is required"
            }, {status: 401})
        }

        const user = await User.findById(tokenId)

        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 401})
        }

        if(tokenId == user._id.toString()){

            const response = NextResponse.json({
                success: true,
                message: "User logged out successfully"
            }, {status: 200})
            
            response.cookies.set("token", "")

            return response;
        }

        return Response.json({
            success: false,
            message: "Something went wrong!"
        }, {status: 400})

        
    } catch (error: any) {
        console.log("ERROR WHILE LOG-OUT: ", error.message)

        return Response.json({
            success: false,
            message: "Error while logging out",
        }, {status: 500})

    }

}
