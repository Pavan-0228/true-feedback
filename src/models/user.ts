import mongoose, {Schema , Document} from "mongoose";

export interface Message extends Document {
    content : string;
    createdAt : Date;
}

const messageSchema: Schema<Message> = new Schema({
    content : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now,
    }
});


export interface User extends Document {
    username : string;
    password : string;
    email : string;
    verifyCode : string;
    verifyCodeExpire : Date;
    isVerified : boolean;
    isAcceptingMessages : boolean;
    messages : Message[];
}


const userSchema: Schema<User> = new Schema({
    username : {
        type : String,
        required : [true, "Username is required"],
        trim : true,
        unique : true
    },
    password : {
        type : String,
        required : [true, "Password is required"],
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : true,
        lowercase : true,
        match : [/\S+@\S+\.\S+/, "Please enter a valid email"]
    },
    verifyCode : {
        type : String,
        required : [true, 'Verification code is required']
    },
    verifyCodeExpire : {
        type : Date,
        required : [true, 'Verification code expiration date is required']
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    isAcceptingMessages : {
        type : Boolean,
        default : true
    },
    messages : [messageSchema]
});


const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema);

export default userModel;