import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"


export const getDataToken = (request: NextRequest)=>{
    try {
        const token = request.cookies?.get("token")?.value 
    
        const decodedToken: any = jwt.verify( token! , process.env.TOKEN_SECRET_KEY!)
    
        return decodedToken._id;

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Error while fetching the token"
        }, {status: 500})
    }

}