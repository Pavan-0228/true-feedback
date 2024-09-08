import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, password, email } = await request.json();

        const existingUserVerified = await userModel.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerified) {
            return Response.json(
                {
                    success: false,
                    message: "username is already taken",
                },
                { status: 400 }
            );
        }


        



    } catch (error) {
        console.error("Error while registering user", error);
        return Response.json(
            {
                success: false,
                message: "register Error",
            },
            {
                status: 500,
            }
        );
    }
}
