const mongoose = require("mongoose");


const pizzaSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    ingredients:{
        type:Array,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    diametr:{
        type:String,
        required:true,
    },
    hight:{
        type:String,
        required:true
    },
    thickness:{
        enum:["thin","bold"],
        type:String,
        required:true
    },
    type:{
        enum:["Katta","O'rtancha","Kichik"],
        type:String,
        required:true
    },
    count:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})



module.exports = mongoose.model("Pizza",pizzaSchema)     