import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, password, email } = await request.json();

        const existingUserVerified  = await userModel.findOne({
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

        const existUserByEmail = await userModel.findOne({ email });

        const verifyCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        if (existUserByEmail) {
            if (existUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "username is already with this email",
                    },
                    { status: 400 }
                );
            } else {
                const hashPassword = await bcrypt.hash(password, 10);
                existUserByEmail.password = hashPassword;
                existUserByEmail.verifyCode = verifyCode;
                existUserByEmail.verifyCodeExpire = new Date(
                    Date.now() + 3600000
                );
                await existUserByEmail.save();
            }
        } else {
            const hashPassword = await bcrypt.hash(password, 10);

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const user = await new userModel({
                username,
                password: hashPassword,
                email,
                verifyCode,
                verifyCodeExpire: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                message: [],
            });

            await user.save();

            //send verification email

            const emailResponse = await sendVerificationEmail(
                email,
                username,
                verifyCode
            );

            if (!emailResponse.success) {
                return Response.json(
                    {
                        success: false,
                        message: emailResponse.message,
                    },
                    { status: 500 }
                );
            }

            return Response.json(
                {
                    success: true,
                    message: "Email send successfully please verify your email",
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
