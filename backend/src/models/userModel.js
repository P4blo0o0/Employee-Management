const { pool } = require('../config/database');

class UserModel {
    static async findByUsername(username) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE username = ? AND is_active = true',
            [username]
        );
        return rows[0] || null;
    }

    static async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ? AND is_active = true',
            [email]
        );
        return rows[0] || null;
    }

    static async findById(id) {
        const query = `
            SELECT u.*, 
                   e.first_name, e.last_name, e.employee_code,
                   d.name as department_name, p.title as position_title
            FROM users u
            LEFT JOIN employees e ON u.employee_id = e.id
            LEFT JOIN departments d ON e.department_id = d.id
            LEFT JOIN positions p ON e.position_id = p.id
            WHERE u.id = ?
        `;
        const [rows] = await pool.execute(query, [id]);
        return rows[0] || null;
    }

    static async updateLastLogin(id) {
        await pool.execute(
            'UPDATE users SET last_login = NOW() WHERE id = ?',
            [id]
        );
    }

    static async create(userData) {
        const { username, email, password, role, employee_id } = userData;
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password, role, employee_id) VALUES (?, ?, ?, ?, ?)',
            [username, email, password, role, employee_id || null]
        );
        return this.findById(result.insertId);
    }
}

module.exports = UserModel;