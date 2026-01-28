import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const verifyToken=(req,res,next)=>{
    const authHead = req.headers.authorization || req.headers.Authorization;
    if(!authHead || !authHead.startsWith("Bearer ")){
        return res.status(400).json({message:"No HEader"});
    }
    const token = authHead.split(" ")[1];
    if(!token){
        return res.status(404).json({message: "No Token Present"});
    }
    console.log("token is ", token);
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.user.userID = decoded.userID;
        next();
    }
    catch(err){
        console.error("JWT VERIFY ERROR ", err);
        return res.status(401).json({message: err.message || "some error occured"});
    }
}