const Inglidient = require("../models/inglidient.model");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// Create Inglidient
exports.createInglidient = asyncHandler(async(req,res,next)=>{
    const {inglidientName,inglidientPrice} = req.body
    const inglidientImg = `http://localhost:5000/public/uploads/${req.files.inglidientImg[0].filename}`;
    if(!inglidientName && !inglidientPrice){
        return next(new ErrorResponse("Maydonlarni to'liq to'ldiring", 404)); 
    }
    if(!inglidientImg){
        return next(new ErrorResponse("Rasmni yuklang", 404));
    }

    const newInglidient = await Inglidient.create({
        inglidientName:inglidientName,
        inglidientImg:inglidientImg,
        inglidientPrice:inglidientPrice,
    }) 
    res.status(201).json({ 
        success:true, 
        message:"Inglidient succesfull created", 
        newInglidient:newInglidient,
    }) 
}) 

// All Inglidients  
exports.allInglidient = asyncHandler(async(req,res,next)=>{
    const inglidients = await Inglidient.find()
    res.status(200).json({
        success:true,
        message: "All Inglidients",
        data:inglidients
    })
})

// One Inglidient
exports.oneInglidient = asyncHandler(async(req,res,next)=>{
    const {inglidient_id}= req.body
    const inglidient= await Inglidient.findOne({id:inglidient_id})
    if(!inglidient_id){
        return next(new ErrorResponse("Inglidient Id sini kiriting iltimos!!!", 404))
    }
    if(!inglidient){
        return next(new ErrorResponse("Inglidient topilmadi", 404))
    }

    res.status(200).json({
        success:true,
        message:"Inglidient topildi",
        inglidient:inglidient
    })
})

// Update Inglidient
exports.updateInglidient = asyncHandler(async(req,res,next)=>{
    const{inglidient_id} = req.body
    const {inglidientName,inglidientPrice}= req.body
    let newInglidientImg = `http://localhost:5000/public/uploads/${req.files.inglidient[0].filename}`;

    if(!inglidientName && !inglidientPrice){
        return next(new ErrorResponse("Malumotlarni to'liq to'ldiring",401))
    }
    if(!newInglidientImg){
        newInglidientImg = await Inglidient.findOne({inglidient_id}).populate("inglidientImg")
    }

    const updatedInglidient = await Inglidient.findByIdAndUpdate(inglidient_id,{
        inglidientName,
        inglidientPrice,
        newInglidientImg,
    })

    res.status(201).json({
        success:true,
        message:"Successfull updated Inglidient",
        data:updatedInglidient
    })
})

// Delete Inglidient 
exports.deleteInglidient = asyncHandler(async(req,res,next)=>{
    const {inglidient_id} = req.body
    if(!inglidient_id){
        return next(new ErrorResponse("Inglidient id si topilmadi yoki kiritilmagan!!!",404))
    }
    await Inglidient.findByIdAndDelete(inglidient_id)
    res.status(200).json({
        success:true,
        message:"Inglidient successfull deleted !!!"
    })
})