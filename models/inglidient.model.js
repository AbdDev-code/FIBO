const mongoose = require('mongoose');

const inglidientSchema = new mongoose.Schema({
    inglidientName:{
        type:String,
        required:true,
    },
    inglidientImg:{
        type:String,
        required:true,
    },
    inglidientPrice:{
        type:Number,
        required:true,
    }
},{timestamps:true})

module.exports = mongoose.model("Inglidient",inglidientSchema);