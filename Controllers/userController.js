const {Sequelize} = require('sequelize');
const user = require('../db/models/user.js');
const catchAsync = require('../utils/catchAsync.js');

const fetchAllUsers = catchAsync( async(req, res, next)=>{
    const allUsers = await user.findAndCountAll({
        where: {
            userType: { [Sequelize.Op.ne]: '0' } // not equal to admin ('0')
        },
        attributes: {excule: ['password']}
    });

    return res.status(200).json({
        status: 'success',
        data: allUsers,
    });
})

module.exports = {fetchAllUsers};
