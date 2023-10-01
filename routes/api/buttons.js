const express = require('express');
const router = express.Router();
const buttonsController = require('../../controllers/buttonsController');

router.route('/')
    .get(buttonsController.getAllButtons)
    .post(buttonsController.createNewButton)
    .patch(buttonsController.resetAllButtons)
    .delete(buttonsController.deleteAllButtons);

router.route('/:id')
    .get(buttonsController.getButton)
    .patch(buttonsController.renameButton)
    .delete(buttonsController.deleteButton);


router.route('/reset/:id')
    .patch(buttonsController.resetButton);

router.route('/press/:id')
    .patch(buttonsController.incrementButton);

router.route('/createdAt/:id')
    .get(buttonsController.getButtonCreatedAt);

router.route('/logs/:id')
    .get(buttonsController.getButtonLogs);


module.exports = router;