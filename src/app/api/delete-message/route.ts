import dbConnect from "@/db/db";
import { User } from "@/model/user.model";
import { getDataToken } from "@/utils/getDataToken";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function POST( request: NextRequest ){

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('id') || ""

    if(!query){
        return Response.json({
            success: false,
            message: "No id provided"
        }, {status: 401})
    }

    const messageId = new mongoose.Types.ObjectId(query)

    // console.log(query)

    await dbConnect();

    try {

        const tokenId = getDataToken(request)

        if(!tokenId){
            return Response.json({
                success: false,
                message: "Unauthorized user",
                error: "Token not fetched"
            }, {status: 401})
        }

        const userId = new mongoose.Types.ObjectId(tokenId)

        const userUpdated = await User.updateOne(
            { _id: userId }, { 
                $pull: { messages: { _id: messageId } }
            }
        )

        if( userUpdated.modifiedCount === 0 ){
            return Response.json({
                success: false,
                message: "Unable to delete the message"
            }, {status: 400})
        }

        const user = await User.findById(userId)

        return Response.json({
            success: false,
            message: "Message deleted successfully!",
            user: user
        }, {status: 200})


        
    } catch (error: any) {
        console.log("ERROR IN DELETING MESSAGE", error)

        return Response.json({
            success: false,
            message: "Error deleting message",
            error: error.response.data.message
        }, {status: 500})

    }

}