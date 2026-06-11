const UserModel = require('../models/userModel');
const { AppError } = require('../middleware/errorHandler');

class AuthController {
    static async login(req, res, next) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                throw new AppError('Please provide username and password', 400);
            }

            // Find user by username or email
            let user = await UserModel.findByUsername(username);
            if (!user) {
                user = await UserModel.findByEmail(username);
            }

            if (!user) {
                throw new AppError('Invalid credentials', 401);
            }

            // Simple password check (no encryption for now)
            if (password !== user.password) {
                throw new AppError('Invalid credentials', 401);
            }

            // Update last login
            await UserModel.updateLastLogin(user.id);

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: userWithoutPassword
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async getCurrentUser(req, res, next) {
        try {
            const userId = req.headers['user-id'];
            
            if (!userId) {
                throw new AppError('Not authenticated', 401);
            }

            const user = await UserModel.findById(userId);
            
            if (!user) {
                throw new AppError('User not found', 404);
            }

            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({
                success: true,
                data: userWithoutPassword
            });
        } catch (error) {
            next(error);
        }
    }

    static async logout(req, res) {
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    }
}

module.exports = AuthController;