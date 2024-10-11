import "next-auth"
import { DefaultSession } from "next-auth";


declare module "next-auth"{
    interface User{
        username?: string;
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
    }
    interface Session{
        user : {
            _id?:string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
        } & DefaultSession['user']
    }
}

declare module "next-auth/jwt"{
    interface JWT{
        id?: string;
        isVerified?: boolean;
        email?: string;
        isAcceptingMessages?: boolean;
    }
}