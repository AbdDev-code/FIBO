const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 300, // OTP 5 daqiqadan keyin o'chiriladi
        },
    },
);

// OTPni tekshirish
otpSchema.methods.matchOtp = async function (enteredOtp) {
    return enteredOtp === this.otp;
};

module.exports = mongoose.model("Otp", otpSchema);
