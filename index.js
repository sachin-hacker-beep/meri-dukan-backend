import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { DBConnection } from './config/DB.config.js';
import { userModel } from './models/user.model.js';
import ProductModel from './models/product.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
const PORT = process.env.PORT || 8000;
app.get('/', (req,res)=>{
    res.send("Meri Dukan Backend is running");
})
app.get('/products',async (req,res)=>{
    try{
        const products = await ProductModel.find({});
        res.status(200).json(products);
    }
    catch{
        console.log("error occured")
    }
})
app.post('/User/SignUp', async (req,res)=>{
    try{
        const {username, email, password}= req.body;
        if(!username || !email || !password){
            return res.status(400).json({message: "All the Fields are Required"});
        }
        const existingUser= await userModel.findOne({email});
        if(existingUser){
            return res.status(409).json({message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser= new userModel({
            username,
            email,
            password:hashedPassword
        })
        await newUser.save();
        const payload = {
            userID: newUser._id,
            email: newUser.email
        }
        const token = jwt.sign({payload},process.env.JWT_SECRET, {expiresIn: '1h'});
        res.cookie('token',token,{
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1 * 60 * 60 * 1000 // 1 hour
        })
        res.status(201).json({message: "User Created Successfully", token});
    }
    catch(err){
        console.log("Error during Sign Up", err);
        res.status(500).json({message: "Internal Server Error"});
    }
})
app.post('/User/login', async (req,res)=>{
    try{
        const {email,password}= req.body;
        if(!email || !password){
            return res.status(400).json({message:"All the Fields are Required"});
        }
        const existingUser = await userModel.findOne({email});
        if(!existingUser){
            return res.status(404).json({message: "User Not Found"})
        }
        const checkPass = await bcrypt.compare(password, existingUser.password);
        if(!checkPass){
            return res.status(401).json({message: "Invalid Credentials"});
        }
        const payload = {
            userID: existingUser._id,
            email: existingUser.email
        }
        const token = jwt.sign({payload},process.env.JWT_SECRET, {expiresIn: '1h'});
        res.cookie('token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1 * 60 * 60 * 1000 // 1 hour
        })
        res.status(200).json({message: "Login Successful"});

    }
    catch(err){
        console.log("Error during Login", err);
        res.status(500).json({message: "Internal Server Error"});
    }
})
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    DBConnection();
})