import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const verifyToken=(req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(405).json({message: "Unauthorized: No token provided"});
    }
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            message: "JWT_SECRET is not defined"
        });
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = {
            userID: decoded.userID
        };
        next();
    }
    catch(err){
        console.error("JWT VERIFY ERROR ", err);
        return res.status(401).json({message: err.message || "some error occured"});
    }
}