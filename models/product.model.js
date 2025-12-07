import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    image:{
        type:[String],
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    subcategory:{
        type:String,
        required:true,
    },
    sizes:{
        type:[String],
        required:true,
    },
    date:{
        type:Date,
        required:true,
    },
    bestseller:{
        type:Boolean,
        required:true,
    }
    }
,{timestamps:true}
);
const ProductModel = mongoose.model("ProductModel",ProductSchema,"Products");
export default ProductModel;