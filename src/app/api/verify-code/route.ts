import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

export async function POST(request: Request) {
    await dbConnect()

    try {

        const {username, code} = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername})

        if(!user){
            return Response.json({
                success: false,
                message: "user not found",
            }, {status: 500})
        }

        // if user found then check if code is valid
        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeNotExpired && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, {status: 200})
        }

        // if code is expired
        else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired, please signup to get a new code"
            }, {status: 400})

        }

        else {
            return Response.json({
                success: false,
                message: "Incorrect verification code"
            }, {status: 400})
        }


    } catch (error) {
        console.log("Error verifying the user", error)
        return Response.json({
            success: false,
            message: "Error verifying the user",
        }, {status: 500})
    }
}