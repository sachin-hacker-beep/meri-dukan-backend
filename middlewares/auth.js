import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const verifyToken=(req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: "Unauthorized: No token provided"});
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = {
            userID: decoded.userID
        };
        next();
    }
    catch(err){
        return res.status(401).json({message: "some error occured"});
    }
}