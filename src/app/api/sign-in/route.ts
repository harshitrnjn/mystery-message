import dbConnect from "@/db/db";
import { User } from "@/model/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";


export async function POST(request: Request){
    await dbConnect();

    try {

        const { identifier, password } = await request.json()

        if(!identifier && !password){
            return Response.json({
                success: false,
                message: "Please fill in all fields",
            }, {status: 401})
        }

        const user = await User.findOne({
            $or: [ { email: identifier }, { username: identifier } ]
        })

        if(!user){
            return Response.json({
                success: false,
                message: "User does not exists",
            }, {status: 400})
        }

        if(user.isVerified){
            const isPasswordCorrect = await bcrypt.compare(password, user.password)

            if(!isPasswordCorrect){
                return Response.json({
                    success: false,
                    message: "Incorrect password",
                }, {status: 400})
            }

            const token = jwt.sign({
                _id: user._id
            }, process.env.TOKEN_SECRET_KEY!, {expiresIn: "1d"})

            const response = NextResponse.json({
                success: true,
                message: "Logged in successfully",
                token: token
            }, {status: 200})

            response.cookies.set("token", token)

            return response

        }else{
           return Response.json({
            success: false,
            message: "User is not verified, Please do verify first and login",
           }, {status: 400})


        }
        
    } catch (error: any) {
        console.log(error)
        return Response.json({
            success: false,
            message: error.response.data.message || "Error while sign in!!"
        }, {status: 500})
    }

}