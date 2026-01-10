import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
dotenv.config();
// app.use(cookieParser());
export const verifyToken=(req,res,next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message: "Unauthorized: No token provided"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({message: "some error occured"});
    }
}