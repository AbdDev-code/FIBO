const mongoose = require("mongoose");


const otpSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    expireAt:{
        type:Date,
    }
},{
    timestamps:true
})

module.exports = mongoose.model("Otp",otpSchema)