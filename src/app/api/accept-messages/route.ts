import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth"; // this user we are getting from next-auth and it is different from the user in UserModel


export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User // here User is coming from next-auth

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "user not authenticated"
        }, {status: 401})
    }

    const userId = user._id;
    const {acceptMessages} = await request.json()

    try {

        const updatedUser = await UserModel.findByIdAndUpdate( userId,
            {isAcceptingMessage: acceptMessages},
            {new: true}
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to update message status"
            }, {status: 401})
        }

        //if there is updatedUser
        return Response.json({
            success: true,
            message: "message status updated successgully",
            updatedUser
        }, {status: 200})
        
    } catch (error) {
        console.log("failed to update message status")

        return Response.json({
            success: false,
            message: "failed to update message status"
        }, {status: 500})
        
    }
}

export async function GET(request: Request) {
    await dbConnect()

    try {
        const session = await getServerSession(authOptions)
        const user: User = session?.user as User
    
        if(!session || !session.user) {
            return Response.json({
                success: false,
                message:"user not authenticated"
            }, {status: 401})
        }
    
        const userId = user._id;
    
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "user not found"
            }, {status: 404})
        }
    
        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage
        }, {status: 200})

    } catch (error) {
        console.log("Error in getting message status", error)

        return Response.json({
            success: false,
            message: "Error in getting message status"
        }, {status: 500})
    }



}