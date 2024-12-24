const User = require("../models/user.model");
const Otp = require("../models/otp.model");
const Pizza = require("../models/pizza.model");
const Cart = require("../models/cart.model")
const mailService = require("../service/mail.service");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const Order = require("../models/order.model");
const Buy = require("../models/buyPizza.model");

// Login controller               +++++++++++++++++++++++++++
exports.login = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorResponse("Email is required", 400));
    }

    // Check if user exists or create a new user
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({ email });
    }

    // Send OTP via email
    await mailService.sendOtp(email);
    res.status(200).json({
        success: true,
        message: "OTP sent to your email",
    });
});

// Verify controller              +++++++++++++++++++++++++++
exports.verify = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(new ErrorResponse("Email and OTP are required", 400));
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
        return next(new ErrorResponse("Invalid OTP or email", 401));
    }

    const isMatch = await otpRecord.matchOtp(otp);
    if (!isMatch) {
        return next(new ErrorResponse("Invalid OTP", 401));
    }

    // Generate JWT token
    const user = await User.findOne({ email });
    const token = user.getJWT();

    // Delete OTP record after verification
    await Otp.deleteOne({ email });

    res.status(200).json({
        success: true,
        token,
        user,
    });
});

// Profile
exports.profile = asyncHandler(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

// Profile Update
exports.profileUpdate = asyncHandler(async (req, res, next) => {
    const user = req.user;
    const userId = req.user._id
    const avatar = `http://localhost:5000/public/uploads/${req.files.avatar[0].filename}`;
    const updateProfile = await User.findByIdAndUpdate(userId,{
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        avatar:avatar
    })
    res.status(201).json({
        success:true,
        message:"Profile updated"
    })
})

// add to cart
exports.addToCartPizza = asyncHandler(async (req, res, next) => {
    const { pizza_id } = req.body;

    // Pizza'ni topish
    const pizza = await Pizza.findOne({ _id: pizza_id });
    if (!pizza) {
        return next(new ErrorResponse("Pitsani id si topilmadi yoki xato", 404));
    }

    const user = req.user._id; // Hozirgi foydalanuvchi ID si

    // Yangi Cart yaratish va foydalanuvchiga bog'lash
    const addCart = await Cart.create({
        pizza: pizza._id,
        user: user, // Foydalanuvchi ID sini saqlash
    });

    // Foydalanuvchining `cart`iga yangi pizza qo'shish
    const userCart = await Cart.find({ user: user }); // Foydalanuvchining barcha cartlarini olish

    // Agar foydalanuvchi mavjud bo'lsa, pizza qo'shish
    if (userCart) {
        req.user.cart.push(addCart);
        await req.user.save(); // Foydalanuvchi ma'lumotlarini yangilash
    }

    res.status(201).json({
        success: true,
        message: "Pizza cartga qo'shildi",
        data: addCart,
    });
});

// buy pizza
exports.buyPizza = asyncHandler(async (req, res, next) => {
    const { pizza_id } = req.body;
    const user = req.user;

    // Pitsani topish
    const pizza = await Pizza.findOne({ _id: pizza_id });
    if (!pizza) {
        return next(new ErrorResponse("Pitsaning ID si topilmadi yoki noto'g'ri", 404));
    }

    // Foydalanuvchini tekshirish
    if (!user) {
        return next(new ErrorResponse("Foydalanuvchi autentifikatsiya qilinmagan", 401));
    }

    // Balansni tekshirish
    if (user.balance < pizza.pizzaPrice) {
        return next(new ErrorResponse("Balansingizda mablag' yetarli emas", 400));
    }

    // Balansni yangilash va sotib olish ma'lumotlarini saqlash
    user.balance -= pizza.pizzaPrice; // Balansni kamaytirish
    await user.save(); // Yangilangan balansni saqlash

    // Sotib olishni yozib qo'yish
    await Buy.create({ pizza: { ...pizza }, // Pitsaning barcha ma'lumotlarini saqlash
        user: { ...user}});
    await Pizza.findByIdAndDelete({ _id: pizza_id })
    // Javob qaytarish
    res.status(201).json({
        pizza,
        success: true,
        message: "Pul to'landi va pitsa sotib olindi",
    });
});


// all users
exports.allUsers = asyncHandler(async(req,res,next)=>{
    const users = await User.find()
    res.json({
        success:true,
        users
    })
})

exports.balance = asyncHandler(async(req,res,next)=>{
    const user = req.user
    const balanceSchote = req.body.balanceSchote
    if(!user){
        return next(new ErrorResponse("User authenticate none",404))
    }
    if(!balanceSchote){
        return next(new ErrorResponse("balansga qancha pul o'tkazish ni kiriting",404))
    }
    user.balance += balanceSchote
    await user.save()
    res.status(201).json({
        success:true,
        message:"Balans to'ldirildi"
    })
})

// Order pizza
exports.orderPizza = asyncHandler(async (req, res, next) => {
    const { pizza_id } = req.body;

    // Pizza'ni tekshirish
    const pizza = await Pizza.findById(pizza_id);
    if (!pizza) {
        return next(new ErrorResponse("Pitsa topilmadi yoki ID xato", 404));
    }

    const user = req.user; // Hozirgi foydalanuvchi
    if (!user) {
        return next(new ErrorResponse("Autentifikatsiya talab qilinadi", 401));
    }

    // Buyurtma yaratish
    const order = await Order.create({
        pizza: pizza._id,
        user: user._id,
        status: "Tayyorlanmoqda", // Boshlang'ich status
    });

    // Statuslarni avtomatik yangilash
    updateOrderStatus(order._id);

    res.status(201).json({
        success: true,
        message: "Buyurtma qabul qilindi",
        data: order,
    });
});

// Order status update function
const updateOrderStatus = async (orderId) => {
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            console.log("Buyurtma topilmadi!");
            return;
        }

        // "Tayyorlanmoqda" -> 2 minut -> "Yetkazilmoqda"
        setTimeout(async () => {
            order.status = "Yetkazilmoqda";
            await order.save();
            console.log(`Order ${orderId}: Status 'Yetkazilmoqda' ga o'zgardi`);

            // "Yetkazilmoqda" -> 5 minut -> "Yetib keldi"
            setTimeout(async () => {
                order.status = "Yetib keldi";
                await order.save();
                console.log(`Order ${orderId}: Status 'Yetib keldi' ga o'zgardi`);
            }, 5 * 60 * 1000); // 5 minut
        }, 2 * 60 * 1000); // 2 minut
    } catch (error) {
        console.error("Buyurtma statusini yangilashda xatolik:", error);
    }
};

// Get all orders
exports.getAllOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find().populate("pizza user"); // Pizza va foydalanuvchi ma'lumotlarini qo'shish
    res.status(200).json({
        success: true,
        data: orders,
    });
});

// Get user's orders
exports.getUserOrders = asyncHandler(async (req, res, next) => {
    const user = req.user;
    const orders = await Order.find({ user: user._id }).populate("pizza");
    res.status(200).json({
        success: true,
        data: orders,
    });
});
  
// Get all prices 
exports.getAllPrices = asyncHandler(async (req, res, next) => {
    try {
        // Barcha buyurtmalarni olish va kerakli maydonlarni populate qilish
        const buys = await Buy.find()
            .populate({ path: 'pizza', select: 'pizzaPrice name' }) // Faqat kerakli maydonlarni tanlash
            .populate({ path: 'user', select: 'name email' }); // Foydalanuvchidan kerakli ma'lumotlarni olish

        // Konsol uchun ma'lumotlarni ko'rish (debug uchun foydali)
        console.log(buys.map(buy => ({
            pizza: buy.pizza,
            pizzaPrice: buy.pizza ? buy.pizza.pizzaPrice : null
        })));

        // 'pizzaPrice' qiymatlarini yig'ish
        const totalIncome = buys.reduce((total, buy) => {
            return buy.pizza?.pizzaPrice ? total + buy.pizza.pizzaPrice : total;
        }, 0);

        const totalOrders = buys.length; // Umumiy buyurtmalar soni

        // Javobni qaytarish
        res.status(200).json({
            success: true,
            totalIncome,   // Umumiy daromad
            totalOrders,   // Umumiy buyurtmalar soni
        });
    } catch (error) {
        // Xatolikni 'next()' orqali yuborish
        next(error);
    }
});

