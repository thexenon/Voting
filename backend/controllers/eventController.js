const Event = require('../models/eventModel');
const factory = require('./handlerFactory');

exports.setRequestedIds = (req, res, next) => {
  if (!req.body.coordinator) req.body.coordinator = req.user.id;
  next();
};

exports.getAllEvents = factory.getAll(Event, 'categories');
exports.getEvent = factory.getOne(Event, 'categories');
exports.createEvent = factory.createOne(Event);
exports.updateEvent = factory.updateOne(Event);
exports.deleteEvent = factory.deleteOne(Event);
