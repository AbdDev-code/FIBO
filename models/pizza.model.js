const mongoose = require('mongoose')

const pizzaSchema = new mongoose.Schema({
    pizzaName:{
        type:String,
        required:true,
    },
    pizzaInglidients:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Inglidient"
    }],
    pizzaPrice:{
        type:Number,
        required:true
    },
    cook:{
        type:String,
        required:true,
    },
    pizzaImg:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true
    }
},{
    timestamps:true
})


module.exports = mongoose.model('Pizza',pizzaSchema)