const express = require('express');
const router = express.Router();
const DepartmentController = require('../controllers/departmentController');
const { validateDepartment } = require('../middleware/validation');

router.route('/')
    .get(DepartmentController.getAll)
    .post(validateDepartment, DepartmentController.create);

router.route('/:id')
    .get(DepartmentController.getById)
    .put(validateDepartment, DepartmentController.update)
    .delete(DepartmentController.delete);

router.get('/:id/employees', DepartmentController.getEmployees);

module.exports = router;