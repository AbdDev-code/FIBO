const Pizza = require("../models/pizza.model");
const Inglidient = require("../models/inglidient.model");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// Pizza yaratish
exports.createPizza = asyncHandler(async (req, res, next) => {
    const { pizzaName, cook, desc, pizzaInglidients } = req.body;

    // Ma'lumotlarni tekshirish
    if (!pizzaName || !cook || !desc || !pizzaInglidients) {
        return next(new ErrorResponse("Maydonlarni to'liq to'ldiring", 401));
    }

    // Rasmni tekshirish
    const pizzaImg = `http://localhost:5000/public/uploads/${req.files.pizzaImg[0].filename}`;
    if (!pizzaImg) {
        return next(new ErrorResponse("Rasm kiritilmagan!!!", 404));
    }

    // Pizza ingridientlarini ID lar orqali olish
    const ingredientIds = pizzaInglidients.split(','); // Vergul bilan ajratilgan ID larni arrayga aylantirish

    // Inglidientlarni topish
    const ingredients = await Inglidient.find({ '_id': { $in: ingredientIds } });

    // Agar inglidientlardan biri topilmasa, xato qaytarish
    if (ingredients.length !== ingredientIds.length) {
        return next(new ErrorResponse("Barcha inglidientlar topilmadi", 404));
    }

    // Inglidientlarning narxlarini yig'ish
    let totalInglidientPrice = 0;
    ingredients.forEach(ingredient => {
        totalInglidientPrice += ingredient.inglidientPrice; // Har bir inglidient narxini yig'ish
    });

    // Yakuniy pizza narxini hisoblash (ingridientlarning narxi + 15)
    const finalPizzaPrice = totalInglidientPrice + 15;

    // Pizza yaratish
    const newPizza = await Pizza.create({
        pizzaName,
        pizzaPrice: finalPizzaPrice,  // Narxni inglidientlarning narxi va qo'shimcha 15 bilan hisoblang
        cook,
        desc,
        pizzaImg,
        pizzaInglidients: ingredients // Inglidientlarni pizza modeliga qo'shish
    });

    // Javobni yuborish
    res.status(201).json({
        success: true,
        message: "Pizza muvaffaqiyatli yaratildi",
        pizza: newPizza
    });
});

// All pizza
exports.allPizzas = asyncHandler(async(req,res,next)=>{
    const pizzas = await Pizza.find()
    res.status(200).json({
        success:true,
        data:pizzas
    })
})

// One pizzas
exports.onePizzas = asyncHandler(async(req,res,next)=>{
    const {pizza_id}= req.body
    if(!pizza_id){
        return next(new ErrorResponse("pizza id sini yozing",404))
    }
    const pizza = await Pizza.findById({_id:pizza_id})
    res.status(200).json({
        success:true,
        message:"Pizza finded",
        data:pizza,
    })
})

// Pizza yangilash
exports.updatePizza = asyncHandler(async (req, res, next) => {
    const { pizzaName, cook, desc, pizzaInglidients } = req.body;
    const {pizza_id} = req.body
    // Ma'lumotlarni tekshirish
    if (!pizzaName || !cook || !desc || !pizzaInglidients) {
        return next(new ErrorResponse("Maydonlarni to'liq to'ldiring", 401));
    }

    // Rasmni tekshirish
    const pizzaImg = `http://localhost:5000/public/uploads/${req.files.pizzaImg[0].filename}`;
    if (!pizzaImg) {
        return next(new ErrorResponse("Rasm kiritilmagan!!!", 404));
    }

    // Pizza ingridientlarini ID lar orqali olish
    const ingredientIds = pizzaInglidients.split(','); // Vergul bilan ajratilgan ID larni arrayga aylantirish

    // Inglidientlarni topish
    const ingredients = await Inglidient.find({ '_id': { $in: ingredientIds } });

    // Agar inglidientlardan biri topilmasa, xato qaytarish
    if (ingredients.length !== ingredientIds.length) {
        return next(new ErrorResponse("Barcha inglidientlar topilmadi", 404));
    }

    // Inglidientlarning narxlarini yig'ish
    let totalInglidientPrice = 0;
    ingredients.forEach(ingredient => {
        totalInglidientPrice += ingredient.inglidientPrice; // Har bir inglidient narxini yig'ish
    });

    // Yakuniy pizza narxini hisoblash (ingridientlarning narxi + 15)
    const finalPizzaPrice = totalInglidientPrice + 15;

    // Pizza yaratish
    const newPizza = await Pizza.findByIdAndUpdate(pizza_id,{
        pizzaName,
        pizzaPrice: finalPizzaPrice,  // Narxni inglidientlarning narxi va qo'shimcha 15 bilan hisoblang
        cook,
        desc,
        pizzaImg,
        pizzaInglidients: ingredients // Inglidientlarni pizza modeliga qo'shish
    });

    // Javobni yuborish
    res.status(201).json({
        success: true,
        message: "Pizza muvaffaqiyatli yangilandi",
        pizza: newPizza
    });
});

// Delete pizzas
exports.deletePizzas = asyncHandler(async(req,res,next)=>{
    const {pizza_id}= req.body
    if(!pizza_id){
        return next(new ErrorResponse("pizza id sini yozing",404))
    }
    await Pizza.findByIdAndDelete({_id:pizza_id})
    res.status(200).json({
        success:true,
        message:"Pizza deleted"
    })
})
