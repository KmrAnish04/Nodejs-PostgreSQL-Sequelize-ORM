const product = require('../db/models/product.js');
const user = require('../db/models/user.js');
const AppError = require('../utils/appError.js');
const catchAsync = require('../utils/catchAsync.js');

const createProject = catchAsync(async (req, res, next) => {
    const body = req.body;
    const userId = req.user.id;

    const newProduct = await product.create({
        title: body.title,
        productImage: body.productImage,
        price: body.price,
        shortDescription: body.shortDescription,
        description: body.description,
        productUrl: body.productUrl,
        category: body.category,
        tags: body.tags,
        createdBy: userId,
    });

    return res.status(201).json({
        status: 'success',
        data: newProduct,
    });
});

const fetchAllProducts = catchAsync( async( req, res, next) => {
    const userId = req.user.id;
    const result = await product.findAll({include: user, where: {createdBy: userId}});
    return res.json({
        status: "Sucess",
        data: result
    });
})

const fetchProductById = catchAsync( async( req, res, next) => {
    const productId = req.params.id;

    const result = await product.findByPk(productId, {include: user});
    if(!result) return next(new AppError('Invalid project ID', 400));

    return res.json({
        status: "Sucess",
        data: result
    });
})

const updateProject = catchAsync( async(req, res, next)=>{
    const productId = req.params.id;
    const userId = req.user.id;
    const newProductDetails = req.body;

    const oldProduct = await product.findOne({where: {id: productId, createdBy: userId}});

    if(!oldProduct) return next(new AppError('Invalid Product ID', 400));

    oldProduct.title = newProductDetails.title;
    oldProduct.productImage = newProductDetails.productImage;
    oldProduct.price = newProductDetails.price;
    oldProduct.shortDescription = newProductDetails.shortDescription;
    oldProduct.description = newProductDetails.description;
    oldProduct.productUrl = newProductDetails.productUrl;
    oldProduct.category = newProductDetails.category;
    oldProduct.tags = newProductDetails.tags;

    const updatedProduct = await oldProduct.save();

    return res.json({
        status: 'success',
        data: updatedProduct,
    });

})

const deleteProject = catchAsync( async(req, res, next)=>{
    const productId = req.params.id;
    const userId = req.user.id;

    const result = await product.findOne({where: {id: productId, createdBy: userId}});

    if(!result) return next(new AppError('Invalid Product ID', 400));

    await result.destroy();

    return res.json({
        status: 'success',
        message: "Record Deleted Successfully!",
    });

})

module.exports = { createProject, fetchAllProducts, fetchProductById, updateProject, deleteProject }