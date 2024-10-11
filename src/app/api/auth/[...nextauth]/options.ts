import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "Enter the email address",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await userModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ],
                    });

                    if (!user) {
                        throw new Error(
                            "No user found with this email or username"
                        );
                    }

                    if (!user.isVerified) {
                        throw new Error("please your account before login");
                    }

                    const isPasswordRight = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordRight) {
                        throw new Error("Password is incorrect");
                    } else {
                        return user;
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user}) {

            if (user){
                token.id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }

            return token;
        },
        async session({ session, token }) {

            if(token){
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user._id = token.id;
                session.user.isVerified = token.isVerified;
            }
            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
