const Nominee = require('../models/nomineeModel');
const factory = require('./handlerFactory');

exports.setRequestedIds = (req, res, next) => {
  if (!req.body.coordinator) req.body.coordinator = req.user.id;
  next();
};

exports.getAllNominees = factory.getAll(Nominee);
exports.getNominee = factory.getOne(Nominee);
exports.createNominee = factory.createOne(Nominee);
exports.updateNominee = factory.updateOne(Nominee);
exports.deleteNominee = factory.deleteOne(Nominee);
