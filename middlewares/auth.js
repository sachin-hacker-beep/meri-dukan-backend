import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const verifyToken=(req,res,next)=>{
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
    if(!token){
        return res.status(401).json({message:"No token Provided"})
    }
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