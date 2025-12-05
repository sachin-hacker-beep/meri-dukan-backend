import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { DBConnection } from './config/DB.config.js';
import ProductModel from './models/product.model.js';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',
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
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    DBConnection();
})