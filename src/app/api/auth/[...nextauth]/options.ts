import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "example@email.com" },
                password: { label: "Password", type: "password" }
              },

              async authorize(credentials: any): Promise<any>{
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })

                    //if not a user
                    if(!user) {
                        throw new Error('No user found with this email')
                    }

                    // check if user verified
                    if(!user.isVerified) {
                        throw new Error('Please verify your account before login')
                    }

                    // now if user is found then compare if password matches or not
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(isPasswordCorrect){
                        return user

                    } else {
                        throw new Error('Incorrect Password')
                    }

                } catch (err: any) {
                    throw new Error(err)
                }
              }
        })
    ],

    callbacks: {
        
        async jwt({ token, user,  }) {
            //since the id doesnot exist in token so we are modifying the token and adding the id in it from the user
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAceeptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
          return token
        },

        async session({ session, token }) {
            if(token){
                session.user._id = token._id as string
                session.user.isVerified = token.isVerified as boolean
                session.user.isAcceptingMessages = token.isAceeptingMessages as boolean
                session.user.username = token.username as string
            }
            return session
          },
    },

    pages: {
        signIn: '/sign-in'
    },

    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
}