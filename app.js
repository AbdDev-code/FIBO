require('dotenv').config();
require('colors');
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const http = require("http")
const app = express();
const server = http.createServer(app)
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',  // Yoki kerakli domenni yozing, masalan: 'https://yourdomain.com'
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
if (process.env.NODE_ENV === "developer") {
    app.use(morgan("dev"));
}


// Connect DB
connectDB();

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Swagger options
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Pizza API",
            version: "1.0.0",
            description: "API documentation for the Pizza application",
            contact: {
                name: "Abd_dev",
                email: "ubaydullayevabdulloh009@gmail.com",
            },
        },
        servers: [
            {
                url: "https://fibo-2.onrender.com/api/v1",
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
              bearerAuth: {
                type: "https",
                scheme: "bearer",
                bearerFormat: "JWT",
              },
            },
          },
    },
    apis: ["./routes/*.js"], // Sizning routes fayllaringiz joylashgan papka
};

// Initialize Swagger docs
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/v1/auth', require("./routes/auth.routes"));
app.use('/api/v1/inglidient', require('./routes/inglidient.routes'));
app.use('/api/v1/pizza', require('./routes/pizza.routes'));

// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`.bgBlue);
});
