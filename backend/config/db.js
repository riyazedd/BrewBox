import mongoose from "mongoose";

const connectDB= async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongo Connected: "+conn.connection.host)
    }catch(err){
        console.log("Error: "+err)
    }
}

export default connectDB;