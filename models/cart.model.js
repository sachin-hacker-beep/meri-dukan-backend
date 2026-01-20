import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    products:[
        {productID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductModel",
            required: true
        },
        selectedSize:{
            type: String, 
            required: true
        },
        quantity:{
            type:Number,
            required:true,
            default:1
        }}
    ]
})
export const cartModel = mongoose.model("cartModel", cartSchema, "cart");