import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/verificationEmail";
import { apiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<apiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: "Verification Code for true feedBack",
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        return {
            success: true,
            message: "successfully to send verification mail",
        };
    } catch (error) {
        console.error("Error while send Verification Email", error);
        return { success: false, message: "Failed to send verification mail" };
    }
}
