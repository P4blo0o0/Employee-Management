const express = require('express');
const router = express.Router();
const PositionController = require('../controllers/positionController');
const { validatePosition } = require('../middleware/validation');

router.route('/')
    .get(PositionController.getAll)
    .post(validatePosition, PositionController.create);

router.route('/:id')
    .get(PositionController.getById)
    .put(validatePosition, PositionController.update)
    .delete(PositionController.delete);

module.exports = router;