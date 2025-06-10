const express = require('express');
const eventController = require('../controllers/eventController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(eventController.getAllEvents)
  .post(
    authController.protect,
    eventController.setRequestedIds,
    authController.restrictTo('admin', 'superadmin'),
    eventController.createEvent,
  );

router
  .route('/:id')
  .get(eventController.getEvent)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'superadmin'),
    eventController.updateEvent,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'superadmin'),
    eventController.deleteEvent,
  );

module.exports = router;
