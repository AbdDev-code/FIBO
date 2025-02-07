const express = require("express");
const { createPizza } = require("../controllers/pizza.controller");
const upload = require("../utils/fileUpload");

const router = express.Router();

// Pizza yaratish (Rasm yuklash bilan)
router.post("/create", upload.single("image"), createPizza);

module.exports = router;
