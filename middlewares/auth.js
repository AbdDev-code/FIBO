const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user.model");
require("dotenv").config();

// Token orqali autentifikatsiya
exports.authenticate = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new ErrorResponse("No token provided", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new ErrorResponse("No user found", 404));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorResponse("Invalid token", 401));
    }
});

// Ruxsatni tekshirish
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(`Role: ${req.user.role} - Ruxsat yo'q`, 403)
            );
        }
        next();
    };
};
