import "next-auth"
import { DefaultSession } from "next-auth";

//here we are modifying the package according to the value which we required
declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string
    }

    interface Session {
        user: {
            _id?:string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string
        } & DefaultSession['user']
    }
}

declare module 'nexct-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string
    }
}