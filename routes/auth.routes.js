const express = require("express");
const {
    login,
    verify,
    profile,
    profileUpdate,
    addToCartPizza,
    allUsers,
    buyPizza,
    balance,
    orderPizza,
    getAllOrders,
    getUserOrders,
    getAllPrices
} = require("../controllers/auth.controller");
const { authenticate, adminAccess } = require("../middlewares/authenticate");
const upload = require("../utils/fileUpload");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: User email
 *       example:
 *         email: user@example.com
 *     Verify:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *       properties:
 *         email:
 *           type: string
 *           description: User email
 *         otp:
 *           type: string
 *           description: OTP code
 *       example:
 *         email: user@example.com
 *         otp: "123456"
 *     ProfileUpdate:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: User first name
 *         lastName:
 *           type: string
 *           description: User last name
 *         avatar:
 *           type: string
 *           format: binary
 *           description: User avatar image
 *       example:
 *         firstName: John
 *         lastName: Doe
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in with email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: OTP sent to the email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     summary: Verify OTP for login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Verify'
 *     responses:
 *       200:
 *         description: Returns JWT token and user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 */
router.post("/verify", verify);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user profile
 */
router.get('/profile', authenticate, profile);

/**
 * @swagger
 * /auth/profile/update:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProfileUpdate'
 *     responses:
 *       201:
 *         description: Profile updated
 */
router.put('/profile/update', authenticate, upload.fields([{ name: "avatar", maxCount: 1 }]), profileUpdate);

/**
 * @swagger
 * /auth/toCart:
 *   post:
 *     summary: Add pizza to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pizza_id:
 *                 type: string
 *             example:
 *               pizza_id: "60d21b9067d0d8992e610c85"
 *     responses:
 *       201:
 *         description: Pizza added to cart
 */
router.post('/toCart', authenticate, addToCartPizza);

/**
 * @swagger
 * /auth/all:
 *   get:
 *     summary: Get all users (Admin access required)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns list of all users
 */
router.get('/all', authenticate, adminAccess, allUsers);

/**
 * @swagger
 * /auth/buyPizza:
 *   post:
 *     summary: Buy a pizza
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pizza_id:
 *                 type: string
 *             example:
 *               pizza_id: "60d21b9067d0d8992e610c85"
 *     responses:
 *       201:
 *         description: Pizza purchased
 */
router.post('/buyPizza', authenticate, buyPizza);

/**
 * @swagger
 * /auth/balanceUpdate:
 *   post:
 *     summary: Update user balance
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *             example:
 *               amount: 50
 *     responses:
 *       200:
 *         description: Balance updated
 */
router.post('/balanceUpdate', authenticate, balance);

/**
 * @swagger
 * /auth/order:
 *   post:
 *     summary: Place a pizza order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pizza_id:
 *                 type: string
 *             example:
 *               pizza_id: "60d21b9067d0d8992e610c85"
 *     responses:
 *       201:
 *         description: Order placed
 */
router.post("/order", authenticate, orderPizza);

/**
 * @swagger
 * /auth/orders:
 *   get:
 *     summary: Get all orders (Admin access required)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns list of all orders
 */
router.get("/orders", authenticate, adminAccess, getAllOrders);

/**
 * @swagger
 * /auth/allBuyPizzasInfo:
 *   get:
 *     tags:
 *       - Buy Pizzas
 *     summary: Barcha buyurtmalar haqida umumiy ma'lumot olish
 *     description: Ushbu endpoint orqali barcha buyurtmalar haqida umumiy daromad va buyurtmalar sonini ko'rishingiz mumkin. Faqat admin huquqiga ega foydalanuvchilar kirishi mumkin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli javob, umumiy daromad va buyurtmalar soni qaytariladi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 totalIncome:
 *                   type: number
 *                   description: Barcha buyurtmalar bo'yicha umumiy daromad.
 *                   example: 45000
 *                 totalOrders:
 *                   type: number
 *                   description: Umumiy buyurtmalar soni.
 *                   example: 3
 *       401:
 *         description: Foydalanuvchi autentifikatsiyadan o'tmagan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Autentifikatsiya talab qilinadi."
 *       403:
 *         description: Foydalanuvchida admin huquqlari yo'q.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Sizda ushbu endpointga kirish uchun ruxsat yo'q."
 *       500:
 *         description: Ichki server xatosi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Xatolik yuz berdi."
 */
router.get("/allBuyPizzasInfo", authenticate, adminAccess, getAllPrices);


module.exports = router;
