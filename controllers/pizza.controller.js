const Pizza = require("../models/pizza.model"); 
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");


// @desc    Create Pizza
// @route   POST /api/pizzas
// @access  Public
exports.createPizza = asyncHandler(async (req, res, next) => {
    const { name, desc, ingredients, diametr, hight, thickness, type } = req.body;

    // Rasm yuklanmagan bo'lsa, xato qaytarish
    if (!req.file) {
        return next(new ErrorResponse("Iltimos, rasm yuklang!", 400));
    }

    // Rasm nomini olish
    const image = req.file.filename;

    // Ingredientlar JSON bo'lsa, uni massivga aylantiramiz
    let parsedIngredients;
    try {
        parsedIngredients = JSON.parse(ingredients);  // JSON.parse qilish
    } catch (error) {
        return next(new ErrorResponse("Ingredientlar noto‘g‘ri formatda!", 400));
    }

    // Agar ingredientlar massiv bo'lmasa yoki bo'sh bo'lsa
    if (!Array.isArray(parsedIngredients) || parsedIngredients.length === 0) {
        return next(new ErrorResponse("Ingredientlar noto‘g‘ri formatda!", 400));
    }

    // Ingredientlar narxini hisoblash
    let totalIngredientsPrice = parsedIngredients.reduce((acc, item) => acc + (item.price || 0), 0);

    // Oshpaz haqini hisoblash (70% qo'shiladi)
    let chefFee = totalIngredientsPrice * 0.7;

    // Pizzaning umumiy narxini hisoblash
    let price = totalIngredientsPrice + chefFee;

    // Pizza yaratish
    const pizza = await Pizza.create({
        name,
        desc,
        price,
        ingredients: parsedIngredients,  // Ingredientlar massivini saqlash
        image,
        diametr,
        hight,
        thickness,
        type
    });

    // Yaratilgan pizzani qaytarish
    res.status(201).json({
        success: true,
        data: pizza
    });
});

