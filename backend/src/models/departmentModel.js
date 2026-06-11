const { pool } = require('../config/database');

class DepartmentModel {
    static async findAll() {
        const query = `
            SELECT d.*, 
                   COUNT(e.id) as employee_count,
                   CONCAT(m.first_name, ' ', m.last_name) as manager_name
            FROM departments d
            LEFT JOIN employees e ON d.id = e.department_id AND e.employment_status = 'active'
            LEFT JOIN employees m ON d.manager_id = m.id
            GROUP BY d.id
            ORDER BY d.name ASC
        `;
        const [rows] = await pool.execute(query);
        return rows;
    }

    static async findById(id) {
        const query = `
            SELECT d.*, 
                   CONCAT(m.first_name, ' ', m.last_name) as manager_name
            FROM departments d
            LEFT JOIN employees m ON d.manager_id = m.id
            WHERE d.id = ?
        `;
        const [rows] = await pool.execute(query, [id]);
        return rows[0] || null;
    }

    static async create(departmentData) {
        const { name, code, description, manager_id } = departmentData;
        const [result] = await pool.execute(
            'INSERT INTO departments (name, code, description, manager_id) VALUES (?, ?, ?, ?)',
            [name, code, description, manager_id || null]
        );
        return this.findById(result.insertId);
    }

    static async update(id, departmentData) {
        const { name, code, description, manager_id, is_active } = departmentData;
        await pool.execute(
            'UPDATE departments SET name=?, code=?, description=?, manager_id=?, is_active=? WHERE id=?',
            [name, code, description, manager_id || null, is_active, id]
        );
        return this.findById(id);
    }

    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM departments WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async getDepartmentEmployees(id) {
        const query = `
            SELECT id, employee_code, first_name, last_name, email, position_id, employment_status
            FROM employees 
            WHERE department_id = ? AND employment_status = 'active'
            ORDER BY last_name, first_name
        `;
        const [rows] = await pool.execute(query, [id]);
        return rows;
    }
}

module.exports = DepartmentModel;