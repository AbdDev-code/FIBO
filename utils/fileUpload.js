const multer = require("multer");
const path = require("path");

// Set Storage
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        const uploadPath = path.join(__dirname,"..","public","uploads");
        cb(null,uploadPath)
    },
    filename:function(req,file,cb){
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )
    },
});

// upload
const upload = multer({
    storage,
    limits:{fileSize:100000000},
    fileFilter(req,file,cb){
        checkFileTypes(file,cb)
    }
})


// check file types
function checkFileTypes(file,cb){
    const filetypes = /jpeg|jfif|jpg|png|gif|awix|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
        cb(null, true)
    }else{
        cb(new Error("only image (jpeg,jpg,png,gif) are allowed"))
    }
}

module.exports = upload