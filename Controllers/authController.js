const user = require('../db/models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AppError = require('../utils/appError.js');
const catchAsync = require('../utils/catchAsync.js');

const generateJwtToken = async(payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });
}

const signup = async (req, res, next) => {
    const body = req.body;

    if(!body){
        return next(new AppError('Provide valid details!', 400));
    }

    if(!['1', '2'].includes(body.userType)){
        return next(new AppError('Invalid user type!', 400));
    }

    let result = null;
    try {
        result = await user.create({
            userType: body.userType,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: body.password,
            confirmPassword: body.confirmPassword
        });
    } catch (err) {
        return next(new AppError(err, 400));
    }

    if(!result) return next(new AppError('Faild To Create New User!', 400));

    const newUser = result.toJSON();
    delete newUser.password;
    delete newUser.createdAt;
    delete newUser.updatedAt;
    delete newUser.deletedAt;

    newUser.token = await generateJwtToken({id: newUser.id});


    res.status(200).json({
        status: 'Success',
        message: "Signup Successfull!",
        data: newUser
    });
}

const login = async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return next(new AppError('Incorrect email or password', 401));
    }

    const isUserExists = await user.findOne({ where: {email: email}});
    if(!isUserExists || !(await bcrypt.compare(password, isUserExists.password) )){
        return next(new AppError('Incorrect email or password', 401));
    }

    const token = await generateJwtToken({id: isUserExists.id});
    const result = isUserExists.toJSON();
    delete result.id;
    delete result.userType;
    delete result.password;
    delete result.createdAt;
    delete result.updatedAt;
    delete result.deletedAt;
    result.token = token;

    return res.status(200).json({
        status: 'Success',
        message: "Login Successfull!",
        data: result
    });
}


const authentication = catchAsync(async (req, res, next) => {
    // 1. get the token from headers
    let idToken = '';
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Bearer asfdasdfhjasdflkkasdf
        idToken = req.headers.authorization.split(' ')[1];
    }
    if (!idToken) {
        return next(new AppError('Please login to get access', 401));
    }
    // 2. token verification
    const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET);
    // 3. get the user detail from db and add to req object
    const freshUser = await user.findByPk(tokenDetail.id);

    if (!freshUser) {
        return next(new AppError('User no longer exists', 400));
    }
    req.user = freshUser;
    return next();
});


const restrictTo = (...userType) => {
    const checkPermission = (req, res, next) => {
        if (!userType.includes(req.user.userType)) {
            return next(
                new AppError(
                    "You don't have permission to perform this action",
                    403
                )
            );
        }
        return next();
    };

    return checkPermission;
};

module.exports = { signup, login, authentication, restrictTo};