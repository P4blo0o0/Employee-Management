const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

const validateEmployee = [
    body('first_name')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
    
    body('last_name')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('phone')
        .optional()
        .trim()
        .matches(/^\+?[\d\s-]{10,}$/).withMessage('Please provide a valid phone number'),
    
    body('hire_date')
        .notEmpty().withMessage('Hire date is required')
        .isDate().withMessage('Please provide a valid date'),
    
    body('department_id')
        .optional()
        .isInt().withMessage('Invalid department ID'),
    
    body('position_id')
        .optional()
        .isInt().withMessage('Invalid position ID'),
    
    body('salary')
        .optional()
        .isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
    
    handleValidationErrors
];

const validateEmployeeUpdate = [
    param('id')
        .isInt().withMessage('Invalid employee ID'),
    
    ...validateEmployee.slice(0, -1), // Remove handleValidationErrors from array
    handleValidationErrors
];

const validateDepartment = [
    body('name')
        .trim()
        .notEmpty().withMessage('Department name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Department name must be between 2 and 100 characters'),
    
    body('code')
        .trim()
        .notEmpty().withMessage('Department code is required')
        .isLength({ min: 2, max: 10 }).withMessage('Department code must be between 2 and 10 characters'),
    
    handleValidationErrors
];

const validatePosition = [
    body('title')
        .trim()
        .notEmpty().withMessage('Position title is required')
        .isLength({ min: 2, max: 100 }).withMessage('Position title must be between 2 and 100 characters'),
    
    body('code')
        .trim()
        .notEmpty().withMessage('Position code is required')
        .isLength({ min: 2, max: 20 }).withMessage('Position code must be between 2 and 20 characters'),
    
    handleValidationErrors
];

module.exports = {
    validateEmployee,
    validateEmployeeUpdate,
    validateDepartment,
    validatePosition
};