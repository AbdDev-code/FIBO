const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        math:[/^\[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"Invalid email"] 
    },
    favourites:{
        type:Array,
    },
    orders:{
        type:Array,
    },
    
},{
    timestamps: true,
});

userSchema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next()
})

// token 
userSchema.methods.getJWT = function (){
    return jwt.sign({id:this._id, email:this.email}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    })
}

// compare password 
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("User",userSchema)