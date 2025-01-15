const express = require('express');
const authRoute = require('./Routes/authRoute.js');
const productRoute = require('./Routes/productRoute.js');
const userRoute = require('./Routes/userRoute.js');
const AppError = require('./utils/appError.js');
const catchAsync = require('./utils/catchAsync.js');
const globalErrorHandler = require('./Controllers/errorController.js')
require('dotenv').config({path: `${process.cwd()}/.env`});

// App
const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', userRoute);
app.use('/api/v1/product', productRoute)

// Error Handling
app.use(
    '*', 
    catchAsync(async (req, res, next)=>{
        throw AppError(`Can't find ${req.originalUrl} on this server`, 404)
    })
);
app.use(globalErrorHandler)

// Port Listening
app.listen(PORT, ()=>{ console.log(`App running on port ${PORT}!`) });