const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    pizza:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Pizza"
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Foydalanuvchining ID sini bog'lash
        required: true
    }
}, {
    timestamps:true
})

module.exports = mongoose.model("Cart",cartSchema)