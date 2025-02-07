const User = require("../models/user.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const jwt = require("jsonwebtoken");
const MailService = require("../services/mail.service");

// @desc    Register user
// @route   /register
// @public
exports.register = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    // Check if user already exists
    const isUser = await User.findOne({ email });
    if (isUser) {
        return next(new ErrorResponse("User already exists", 400));
    }

    // Send OTP
    const sendOtp = await MailService.sendOtp(email);
    if (!sendOtp) {
        return next(new ErrorResponse("Failed to send OTP", 500));
    }

    // Create user
    const user = await User.create({ email });
    const token = user.getJWT();
    
    res.status(200).json({ 
        success: true, 
        token: token, 
        message: "OTP sent successfully. Please verify."
    });
});

// @desc    Login user
// @route   /login
// @public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    // Verify OTP
    const verifyOtp = await MailService.verifyOtp(email, otp);
    if (!verifyOtp.success) {
        return next(new ErrorResponse(verifyOtp.message, 400));
    }

    // Generate token
    const token = user.getJWT();
    
    res.status(200).json({ 
        success: true, 
        token: token, 
        message: "Login successful"
    });
});
