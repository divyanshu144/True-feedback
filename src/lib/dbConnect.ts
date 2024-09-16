import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number  // means optional hai agar value hai tabh bhi sahi hai aur nai hai toh bhi sahi hai
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {

    //checking if connection is already existing or not
    if(connection.isConnected){
        console.log("Already connected to databse")
        return
    }
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})

        connection.isConnected = db.connections[0].readyState

        console.log("DB", db)
        console.log("db.connections", db.connections)

        console.log("DB Connected Successfully")

    } catch (error) {

        console.log("Database Connection Failed", error);
        process.exit(1)
    }
}

export default dbConnect