const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
        },
        firstName: {
            type: String,
            default: "",
        },
        lastName: {
            type: String,
            default: "",
        },
        avatar: {
            type: String,
            default: "",
        },
        cart:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Pizza"
        }],
        isAdmin:{
            type:Boolean,
            default:false,
        },
        balance:{
            type:Number,
            default:0
        },
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// JWT token generation
userSchema.methods.getJWT = function () {
    return jwt.sign(
        { id: this._id, email: this.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

module.exports = mongoose.model("User", userSchema);
