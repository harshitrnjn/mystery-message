import dbConnect from "@/db/db";
import { User } from "@/model/user.model";

export async function GET( request : Request, 
    { params } : { params: any } ){
  

  const username = params.username

  if(!username){
    return Response.json({
      success: false,
      message: "Unauthorized Access"
    }, { status: 401 })
  }

  try {
    await dbConnect();

    const userByUsername = await User.findOne({ username })

    if(!userByUsername){
      return Response.json({
        success: false,
        message: "User with this username does not exist"
      }, { status: 400 })
    }

    return Response.json({
      success: true,
      message: "User fetched successfully",
      data: userByUsername.verifyCode
    }, { status: 200 })

  } catch (error:any) {

    console.log("Error while fetching otp", error.message)

    return Response.json({
      success: false,
      message: "Internal Server Error"
    }, { status: 500 })
  }

}