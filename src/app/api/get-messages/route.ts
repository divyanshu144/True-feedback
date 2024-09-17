import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth"; // this user we are getting from next-auth and it is different from the user in UserModel
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User // here User is coming from next-auth

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "user not authenticated"
        }, {status: 401})
    }

    // here since user-_id is in string as we have defined it as string but need to pass it as object as required for aggregation pipeline
    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const user = await UserModel.aggregate([
            // can write multiple pipelines
            {$match: {id: userId} },
            {$unwind: '$messages'},
            // $unwind -> used to convert or break array into multiple objects
            // The messages field is an array with multiple items. 
            //If you use $unwind on the messages field, it will break this document into three separate documents, one for each message:
            {$sort: {'messages.createdAt': -1 }},
            {$group : {_id: '$_id', messages: { $push: 'messages'}}}
            //he $group stage is used to group documents by a specific field and 
            //then perform operations (like summing, counting, averaging, etc.) on the grouped data.
        ])

        if(!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "user not found"
            }, {status: 401})
        }

        // the aggregate pipeline used above will return array
        return Response.json({
            success: true,
            messages: user[0].messages
        }, {status: 200})

    } catch (error) {
        console.log("An unexpected error occured:", error)
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
        
    }
}