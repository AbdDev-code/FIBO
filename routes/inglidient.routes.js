const router = require("express").Router();
const {createInglidient, allInglidient, oneInglidient, updateInglidient, deleteInglidient} = require("../controllers/inglidient.controller");
const {authenticate, adminAccess} = require("../middlewares/authenticate");
const upload = require("../utils/fileUpload");

/**
 * @swagger
 * /inglidient/create:
 *   post:
 *     summary: Create a new ingredient
 *     tags: [Inglidients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               inglidientName:
 *                 type: string
 *                 description: Name of the ingredient
 *               inglidientPrice:
 *                 type: number
 *                 description: Price of the ingredient
 *               inglidientImg:
 *                 type: string
 *                 format: binary
 *                 description: Ingredient image
 *     responses:
 *       201:
 *         description: Ingredient created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 newInglidient:
 *                   type: object
 *                   $ref: '#/components/schemas/Inglidient'
 *       400:
 *         description: Missing required fields
 */

/**
 * @swagger
 * /inglidient/all:
 *   get:
 *     summary: Get all ingredients
 *     tags: [Inglidients]
 *     responses:
 *       200:
 *         description: List of all ingredients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inglidient'
 */

/**
 * @swagger
 * /inglidient/one:
 *   get:
 *     summary: Get a single ingredient by ID
 *     tags: [Inglidients]
 *     parameters:
 *       - in: query
 *         name: ingredient_id
 *         description: The ID of the ingredient to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingredient found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inglidient'
 *       404:
 *         description: Ingredient not found
 */

/**
 * @swagger
 * /inglidient/update:
 *   put:
 *     summary: Update an ingredient by ID
 *     tags: [Inglidients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               ingredient_id:
 *                 type: string
 *                 description: The ID of the ingredient to update
 *               inglidientName:
 *                 type: string
 *                 description: New name of the ingredient
 *               inglidientPrice:
 *                 type: number
 *                 description: New price of the ingredient
 *               inglidientImg:
 *                 type: string
 *                 format: binary
 *                 description: New ingredient image
 *     responses:
 *       200:
 *         description: Ingredient updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 updatedInglidient:
 *                   type: object
 *                   $ref: '#/components/schemas/Inglidient'
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /inglidient/delete:
 *   delete:
 *     summary: Delete an ingredient by ID
 *     tags: [Inglidients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ingredient_id:
 *                 type: string
 *                 description: The ID of the ingredient to delete
 *     responses:
 *       200:
 *         description: Ingredient deleted successfully
 *       404:
 *         description: Ingredient not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Inglidient:
 *       type: object
 *       required:
 *         - inglidientName
 *         - inglidientPrice
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the ingredient
 *         inglidientName:
 *           type: string
 *           description: The name of the ingredient
 *         inglidientPrice:
 *           type: number
 *           description: The price of the ingredient
 *         inglidientImg:
 *           type: string
 *           description: URL of the ingredient image
 */

router.post("/create", authenticate, adminAccess, upload.fields([{name:"inglidientImg", maxCount:1}]), createInglidient);
router.get("/all", allInglidient);
router.get('/one', oneInglidient);
router.put("/update", authenticate, adminAccess, upload.fields([{name:"inglidientImg", maxCount:1}]), updateInglidient);
router.delete('/delete', authenticate, adminAccess, deleteInglidient);

module.exports = router;
