import {DBConnection} from './config/db.config.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import ProductModel from './models/product.model.js';
// import products from '/data.json' assert {type: 'json'};
import fs from 'fs';
const products = JSON.parse(fs.readFileSync('data.json','utf-8'));
dotenv.config();
export const seedScript = async() => {
    try{
        await DBConnection();
        await ProductModel.deleteMany({});
        await ProductModel.insertMany(products);
        console.log("products inserted successfully");
        process.exit();
    }
    catch(error){
        console.log("Seeding Failed !!!", error);
        process.exit(1);
    }
};
seedScript();