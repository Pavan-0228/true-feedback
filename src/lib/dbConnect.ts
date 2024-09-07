import mongoose from "mongoose";

type connectionObject = {
    isConnection?: number;
};

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnection) {
        console.log("already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "");

        console.log(db);

        connection.isConnection = db.connections[0].readyState;

        console.log("db connect successfully");
    } catch (error) {
        console.log("DB connection fail" ,error);
        process.exit(1);
    }
}

export default dbConnect;