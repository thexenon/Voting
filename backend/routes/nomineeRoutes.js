const express = require('express');
const nomineeController = require('../controllers/nomineeController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(nomineeController.getAllNominees)
  .post(
    authController.protect,
    nomineeController.setRequestedIds,
    authController.restrictTo('admin', 'superadmin'),
    nomineeController.createNominee,
  );

router
  .route('/:id')
  .get(nomineeController.getNominee)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'superadmin'),
    nomineeController.updateNominee,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'superadmin'),
    nomineeController.deleteNominee,
  );

module.exports = router;
