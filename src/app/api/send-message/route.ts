import dbConnect from "@/db/db";
import { User } from "@/model/user.model";


export async function POST( request: Request ){
    await dbConnect();

    try {

        const { username, content } = await request.json()

        if(!content){
            return Response.json({
                success: false,
                message: "Content field cannot be empty"
            }, { status: 400 })
        }

        const user = await User.findOne({username})

        if(!user){
            return Response.json({
                success: false,
                message: "User does not exists!"
            }, {status: 400})
        }
        
        if( !user.isAcceptingMessages ){
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            }, {status: 401})
        }else{
            const newMessage: any = {
                content: content,
            }
            
            user.messages.push(newMessage)
            await user.save();

            const fetchUser = await User.findById(user._id)

            return Response.json({
                success: true,
                message: "Message sent successfully",
                user: fetchUser
            }, {status: 200});

        }
        
    } catch (error: any) {
        console.log(error.message)
        return Response.json({
            success: false,
            message: `Error while sending message`
        }, { status: 500 })
    }
}