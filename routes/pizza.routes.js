const router = require("express").Router();
const {
  createPizza,
  allPizzas,
  onePizzas,
  updatePizza,
  deletePizzas,
} = require("../controllers/pizza.controller");
const { authenticate, adminAccess } = require("../middlewares/authenticate");
const upload = require("../utils/fileUpload");

/**
 * @swagger
 * components:
 *   schemas:
 *     Pizza:
 *       type: object
 *       required:
 *         - pizzaName
 *         - cook
 *         - desc
 *         - pizzaInglidients
 *       properties:
 *         pizzaName:
 *           type: string
 *           description: Pizza nomi
 *         cook:
 *           type: string
 *           description: Oshpaz ismi
 *         desc:
 *           type: string
 *           description: Pizza tavsifi
 *         pizzaInglidients:
 *           type: array
 *           items:
 *             type: string
 *           description: Pizza tarkibidagi ingredientlar IDlari
 *         pizzaImg:
 *           type: string
 *           format: binary
 *           description: Pizza rasmi
 */

/**
 * @swagger
 * /pizza/create:
 *   post:
 *     summary: Yangi pizza yaratish
 *     tags: [Pizza]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Pizza'
 *     responses:
 *       201:
 *         description: Pizza muvaffaqiyatli yaratildi
 *       400:
 *         description: Maydonlarni to‘ldirishda xatolik
 *       401:
 *         description: Foydalanuvchi autentifikatsiya qilinmagan
 */
router.post(
  "/create",
  authenticate,
  adminAccess,
  upload.fields([{ name: "pizzaImg", maxCount: 1 }]),
  createPizza
);

/**
 * @swagger
 * /pizza/all:
 *   get:
 *     summary: Barcha pizzalarni olish
 *     tags: [Pizza]
 *     responses:
 *       200:
 *         description: Pizzalar ro'yxati
 */
router.get("/all", allPizzas);

/**
 * @swagger
 * /pizza/one:
 *   get:
 *     summary: Bitta pizzani olish
 *     tags: [Pizza]
 *     parameters:
 *       - in: query
 *         name: pizza_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Pizzaning ID si
 *     responses:
 *       200:
 *         description: Pizza topildi
 *       404:
 *         description: Pizza topilmadi
 */
router.get("/one", onePizzas);

/**
 * @swagger
 * /pizza/update:
 *   put:
 *     summary: Pizzani yangilash
 *     tags: [Pizza]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Pizza'
 *     responses:
 *       201:
 *         description: Pizza muvaffaqiyatli yangilandi
 */
router.put(
  "/update",
  authenticate,
  adminAccess,
  upload.fields([{ name: "pizzaImg", maxCount: 1 }]),
  updatePizza
);

/**
 * @swagger
 * /pizza/delete:
 *   delete:
 *     summary: Pizzani o'chirish
 *     tags: [Pizza]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pizza_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Pizzaning ID si
 *     responses:
 *       200:
 *         description: Pizza muvaffaqiyatli o'chirildi
 *       404:
 *         description: Pizza topilmadi
 */
router.delete("/delete", authenticate, adminAccess, deletePizzas);

module.exports = router;
