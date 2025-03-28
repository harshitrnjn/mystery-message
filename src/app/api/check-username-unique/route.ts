import dbConnect from "@/db/db";
import { User } from "@/model/user.model";
import { usernameValidation, signupSchema } from "@/schema/signupSchema";
import { z } from "zod";

const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET( request : Request ){
    await dbConnect();

    try {

        const { searchParams } = new URL(request.url)
        const queryParams = {
            username: searchParams.get("username")
        }

        //zod validation
        const result = usernameQuerySchema.safeParse(queryParams)

        console.log(result)

        if(!result.success){
            console.log("Validation of username went wrong")
            const usernameValidationError = result.error.format()
            return Response.json({
                success: false,
                message: "Username is not in correct format",
                error: usernameValidationError 
            }, {status: 401})
        }

        const { username } = result.data

        const existingVerifiedUser = await User.findOne({username: username, isVerified: true})

        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: "Username is already taken",
            }, {status: 400})
        }

        return Response.json({
            success: true,
            message: "Username is unique",
            username: queryParams.username
        }, {status: 200})


        
    } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message: "Error fetching username"
        }, {status: 500})
    }

}