import { Message } from "@/models/user";

export interface apiResponse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>

}