import dotenv from 'dotenv';
import mongoose from 'mongoose';    
dotenv.config();
export const DBConnection =async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        if(!conn){
            console.log("MongoDB Atlas not Connected !!!");
        }
        console.log("MongoDB Atlas Connected")
    }
    catch(error){
        return console.log(`Error : ${error.message}`);
    }
};