const EmployeeModel = require('../models/employeeModel');
const { AppError } = require('../middleware/errorHandler');

class EmployeeController {
    static async getAll(req, res, next) {
        try {
            const result = await EmployeeModel.findAll(req.query);
            
            res.status(200).json({
                success: true,
                ...result.pagination,
                data: result.data
            });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const employee = await EmployeeModel.findById(req.params.id);
            
            if (!employee) {
                throw new AppError('Employee not found', 404);
            }
            
            res.status(200).json({
                success: true,
                data: employee
            });
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            // Check if email already exists
            const existingEmployee = await EmployeeModel.findByEmail(req.body.email);
            if (existingEmployee) {
                throw new AppError('Employee with this email already exists', 409);
            }
            
            const employee = await EmployeeModel.create(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Employee created successfully',
                data: employee
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            // Check if employee exists
            const existingEmployee = await EmployeeModel.findById(req.params.id);
            if (!existingEmployee) {
                throw new AppError('Employee not found', 404);
            }
            
            // If email is being updated, check for duplicates
            if (req.body.email && req.body.email !== existingEmployee.email) {
                const emailExists = await EmployeeModel.findByEmail(req.body.email);
                if (emailExists) {
                    throw new AppError('Employee with this email already exists', 409);
                }
            }
            
            const employee = await EmployeeModel.update(req.params.id, req.body);
            
            res.status(200).json({
                success: true,
                message: 'Employee updated successfully',
                data: employee
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            await EmployeeModel.delete(req.params.id);
            
            res.status(200).json({
                success: true,
                message: 'Employee archived successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    static async getStats(req, res, next) {
        try {
            const stats = await EmployeeModel.getEmployeeStats();
            const distribution = await EmployeeModel.getDepartmentDistribution();
            
            res.status(200).json({
                success: true,
                data: {
                    stats,
                    departmentDistribution: distribution
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async bulkImport(req, res, next) {
        try {
            const { employees } = req.body;
            
            if (!Array.isArray(employees) || employees.length === 0) {
                throw new AppError('Please provide an array of employees', 400);
            }
            
            const results = [];
            const errors = [];
            
            for (let i = 0; i < employees.length; i++) {
                try {
                    const employee = await EmployeeModel.create(employees[i]);
                    results.push(employee);
                } catch (error) {
                    errors.push({
                        index: i,
                        employee: employees[i],
                        error: error.message
                    });
                }
            }
            
            res.status(201).json({
                success: true,
                message: `Imported ${results.length} employees successfully`,
                imported: results.length,
                failed: errors.length,
                errors: errors.length > 0 ? errors : undefined,
                data: results
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = EmployeeController;