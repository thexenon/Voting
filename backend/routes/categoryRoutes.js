const express = require('express');
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(categoryController.getAllCategorys)
  .post(
    authController.protect,
    categoryController.setRequestedIds,
    authController.restrictTo('admin', 'superadmin'),
    categoryController.createCategory,
  );

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'superadmin'),
    categoryController.updateCategory,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'superadmin'),
    categoryController.deleteCategory,
  );

module.exports = router;
