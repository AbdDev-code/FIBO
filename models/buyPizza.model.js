const mongoose = require("mongoose");

const buySchema = new mongoose.Schema({
    pizza:{
        type:Object,
        required: true
    },
    user: {
        type: Object,
        required: true
    }
}, {
    timestamps:true
})

module.exports = mongoose.model("Buy",buySchema)