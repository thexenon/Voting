const Category = require('../models/categoryModel');
const factory = require('./handlerFactory');

exports.setRequestedIds = (req, res, next) => {
  if (!req.body.coordinator) req.body.coordinator = req.user.id;
  next();
};

exports.getAllCategorys = factory.getAll(Category, 'nominees');
exports.getCategory = factory.getOne(Category, 'nominees');
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
