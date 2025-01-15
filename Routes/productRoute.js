const router = require('express').Router();
const { createProject, fetchAllProducts, fetchProductById, updateProject, deleteProject } = require('../Controllers/productController.js');
const { authentication, restrictTo } = require('../Controllers/authController.js');

router.get('/', authentication, restrictTo('1'), fetchAllProducts);
router.route('/:id')
    .get(authentication, restrictTo('1'), fetchProductById)
    .patch(authentication, restrictTo('1'), updateProject)
    .delete(authentication, restrictTo('1'), deleteProject)


router.post('/create', authentication, restrictTo('1'), createProject);

module.exports = router;