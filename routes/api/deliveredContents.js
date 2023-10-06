const express = require('express');
const router = express.Router();
const deliveredContentsController = require('../../controllers/deliveredContentsController');

router.route('/')
    .get(deliveredContentsController.getAllDeliveredContents)
    .post(deliveredContentsController.createNewDeliveredContent)
    .delete(deliveredContentsController.deleteAllDeliveredContents);

router.route('/:id')
    .get(deliveredContentsController.getDeliveredContent)
    .patch(deliveredContentsController.modifyDeliveredContent)
    .delete(deliveredContentsController.deleteDeliveredContent);

router.route('/:id/createdAt')
    .get(deliveredContentsController.getDeliveredContentCreatedAt);

router.route('/:id/log')
    .get(deliveredContentsController.getDeliveredContentLog);

router.route('/title/:title')
    .get(deliveredContentsController.getDeliveredContentByTitle);
    

module.exports = router;