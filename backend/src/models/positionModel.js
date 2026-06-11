const { pool } = require('../config/database');

class PositionModel {
    static async findAll(departmentId = null) {
        let query = `
            SELECT p.*, 
                   d.name as department_name,
                   COUNT(e.id) as employee_count
            FROM positions p
            LEFT JOIN departments d ON p.department_id = d.id
            LEFT JOIN employees e ON p.id = e.position_id AND e.employment_status = 'active'
        `;
        
        const params = [];
        if (departmentId) {
            query += ' WHERE p.department_id = ?';
            params.push(departmentId);
        }
        
        query += ' GROUP BY p.id ORDER BY p.title ASC';
        
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findById(id) {
        const query = `
            SELECT p.*, d.name as department_name
            FROM positions p
            LEFT JOIN departments d ON p.department_id = d.id
            WHERE p.id = ?
        `;
        const [rows] = await pool.execute(query, [id]);
        return rows[0] || null;
    }

    static async create(positionData) {
        const { title, code, department_id, salary_range_min, salary_range_max, requirements } = positionData;
        const [result] = await pool.execute(
            'INSERT INTO positions (title, code, department_id, salary_range_min, salary_range_max, requirements) VALUES (?, ?, ?, ?, ?, ?)',
            [title, code, department_id, salary_range_min, salary_range_max, requirements]
        );
        return this.findById(result.insertId);
    }

    static async update(id, positionData) {
        const { title, code, department_id, salary_range_min, salary_range_max, requirements, is_active } = positionData;
        await pool.execute(
            'UPDATE positions SET title=?, code=?, department_id=?, salary_range_min=?, salary_range_max=?, requirements=?, is_active=? WHERE id=?',
            [title, code, department_id, salary_range_min, salary_range_max, requirements, is_active, id]
        );
        return this.findById(id);
    }

    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM positions WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = PositionModel;