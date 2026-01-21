import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { DBConnection } from './config/DB.config.js';
import { userModel } from './models/user.model.js';
import ProductModel from './models/product.model.js';
import { cartModel } from './models/cart.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { verifyToken } from './middlewares/auth.js';
dotenv.config();
const app = express();
app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend-domain.vercel.app' // add this
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(cookieParser());

const PORT = process.env.PORT || 8000;
app.get('/', (req,res)=>{
    res.send("Meri Dukan Backend is running");
})
app.get('/products',async (req,res)=>{
    try{
        const products = await ProductModel.find({});
        res.status(200).json(products);
    }
    catch(err){
        console.log("Error while fetching products", err);
        res.status(500).json({message: "internal server error"})
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
        
        const token = jwt.sign({userID: newUser._id,
            email: newUser.email},process.env.JWT_SECRET, {expiresIn: '1h'});
        const isProd = process.env.NODE_ENV === 'production';

res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 60 * 60 * 1000
});


        res.status(201).json({message: "User Created Successfully"});
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

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const token = jwt.sign({userID: existingUser._id,
            email: existingUser.email},process.env.JWT_SECRET, {expiresIn: '1h'});
        const isProd = process.env.NODE_ENV === 'production';

        res.cookie('token', token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 60 * 60 * 1000
        });
        res.status(200).json({message: "Login Successful"});

    }
    catch(err){
        console.log("Error during Login", err);
        res.status(500).json({message: "Internal Server Error"});
    }
})

                    //  Making cart Api-s   
          
app.post('/add/:productID',verifyToken, async(req,res)=>{
    try{
        const {productID}= req.params;
        const {selectedSize} = req.body;
        const userID = req.user.userID;
        if(!selectedSize){
            return res.status(400).json({message: "Please select a size"});
        }
        let cart= await cartModel.findOne({userID});
        if(!cart){
            cart = new cartModel({
                userID,
                products:[{productID, selectedSize, quantity:1}]
            })
            await cart.save();
            return res.status(201).json({message:"product added to cart"})
        }
        
        const existingItem = cart.products.find(item=> item.productID.toString() === productID && item.selectedSize === selectedSize);
        if(existingItem){
            existingItem.quantity +=1;
            await cart.save();
        }
        else{
            cart.products.push({productID, selectedSize, quantity:1});
            await cart.save();
                // return res.status(200).json({message: "Product added to cart"});
            }
            return res.status(200).json({message: "Product quantity updated in cart"});
        }
        catch(err){
            console.log("Error while adding to cart", err);
            res.status(500).json({message: "Internal Server Error"});
        }
    })                    

app.get('/cart', verifyToken, async(req,res)=>{
    try{
        const userID = req.user.userID;
        const cart = await cartModel.findOne({userID});
        if(!cart){
            res.status(200).json({products:[]});
        }
        else{
            res.status(200).json(cart.products);
        }
        
    }
    catch(err){
        console.log("Error while fetching cart", err);
        res.status(500).json({message: "Internal Server Error"});
    }
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    DBConnection();
})