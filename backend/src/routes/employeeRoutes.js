const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employeeController');
const { validateEmployee, validateEmployeeUpdate } = require('../middleware/validation');

router.route('/')
    .get(EmployeeController.getAll)
    .post(validateEmployee, EmployeeController.create);

router.get('/stats', EmployeeController.getStats);
router.post('/bulk-import', EmployeeController.bulkImport);

router.route('/:id')
    .get(EmployeeController.getById)
    .put(validateEmployeeUpdate, EmployeeController.update)
    .delete(EmployeeController.delete);

module.exports = router;