import { Message } from "@/model/user";

export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean  //optional
    messages?: Array<Message>
}