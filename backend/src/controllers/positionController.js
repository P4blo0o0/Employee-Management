const PositionModel = require('../models/positionModel');
const { AppError } = require('../middleware/errorHandler');

class PositionController {
    static async getAll(req, res, next) {
        try {
            const departmentId = req.query.department_id || null;
            const positions = await PositionModel.findAll(departmentId);
            
            res.status(200).json({
                success: true,
                count: positions.length,
                data: positions
            });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const position = await PositionModel.findById(req.params.id);
            
            if (!position) {
                throw new AppError('Position not found', 404);
            }
            
            res.status(200).json({
                success: true,
                data: position
            });
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const position = await PositionModel.create(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Position created successfully',
                data: position
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const position = await PositionModel.update(req.params.id, req.body);
            
            if (!position) {
                throw new AppError('Position not found', 404);
            }
            
            res.status(200).json({
                success: true,
                message: 'Position updated successfully',
                data: position
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const deleted = await PositionModel.delete(req.params.id);
            
            if (!deleted) {
                throw new AppError('Position not found', 404);
            }
            
            res.status(200).json({
                success: true,
                message: 'Position deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PositionController;