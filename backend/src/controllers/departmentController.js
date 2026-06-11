 const DepartmentModel = require('../models/departmentModel');
const { AppError } = require('../middleware/errorHandler');

class DepartmentController {
    static async getAll(req, res, next) {
        try {
            const departments = await DepartmentModel.findAll();
            
            res.status(200).json({
                success: true,
                count: departments.length,
                data: departments
            });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const department = await DepartmentModel.findById(req.params.id);
            
            if (!department) {
                throw new AppError('Department not found', 404);
            }
            
            res.status(200).json({
                success: true,
                data: department
            });
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const department = await DepartmentModel.create(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Department created successfully',
                data: department
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const department = await DepartmentModel.update(req.params.id, req.body);
            
            if (!department) {
                throw new AppError('Department not found', 404);
            }
            
            res.status(200).json({
                success: true,
                message: 'Department updated successfully',
                data: department
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const deleted = await DepartmentModel.delete(req.params.id);
            
            if (!deleted) {
                throw new AppError('Department not found', 404);
            }
            
            res.status(200).json({
                success: true,
                message: 'Department deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    static async getEmployees(req, res, next) {
        try {
            const employees = await DepartmentModel.getDepartmentEmployees(req.params.id);
            
            res.status(200).json({
                success: true,
                count: employees.length,
                data: employees
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = DepartmentController;