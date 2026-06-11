const { pool } = require('../config/database');
const { generateEmployeeCode, getPaginationParams } = require('../utils/helpers');

class EmployeeModel {
    static async findAll(filters = {}) {
        const { search, status, department, page, limit, sortBy, sortOrder } = filters;
        const { offset } = getPaginationParams(filters);
        
        let query = `
            SELECT e.*, 
                   d.name as department_name,
                   p.title as position_title,
                   CONCAT(m.first_name, ' ', m.last_name) as manager_name
            FROM employees e
            LEFT JOIN departments d ON e.department_id = d.id
            LEFT JOIN positions p ON e.position_id = p.id
            LEFT JOIN employees m ON e.manager_id = m.id
            WHERE 1=1
        `;
        
        const params = [];
        
        if (search) {
            query += ` AND (e.first_name LIKE ? OR e.last_name LIKE ? OR e.email LIKE ? OR e.employee_code LIKE ?)`;
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam, searchParam);
        }
        
        if (status) {
            query += ' AND e.employment_status = ?';
            params.push(status);
        }
        
        if (department) {
            query += ' AND e.department_id = ?';
            params.push(department);
        }
        
        // Get total count for pagination
        const countQuery = query.replace('SELECT e.*, d.name as department_name, p.title as position_title, CONCAT(m.first_name, \' \', m.last_name) as manager_name', 'SELECT COUNT(*) as total');
        const [countResult] = await pool.execute(countQuery, params);
        const total = countResult[0].total;
        
        // Add sorting and pagination
        const allowedSortColumns = ['first_name', 'last_name', 'email', 'hire_date', 'created_at', 'employee_code'];
        const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
        const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';
        
        query += ` ORDER BY e.${sortColumn} ${order} LIMIT ? OFFSET ?`;
        params.push(parseInt(limit) || 10, offset);
        
        const [rows] = await pool.execute(query, params);
        
        return {
            data: rows,
            pagination: {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                total,
                totalPages: Math.ceil(total / (parseInt(limit) || 10))
            }
        };
    }

    static async findById(id) {
        const query = `
            SELECT e.*, 
                   d.name as department_name,
                   p.title as position_title,
                   CONCAT(m.first_name, ' ', m.last_name) as manager_name
            FROM employees e
            LEFT JOIN departments d ON e.department_id = d.id
            LEFT JOIN positions p ON e.position_id = p.id
            LEFT JOIN employees m ON e.manager_id = m.id
            WHERE e.id = ?
        `;
        const [rows] = await pool.execute(query, [id]);
        return rows[0] || null;
    }

    static async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM employees WHERE email = ?',
            [email]
        );
        return rows[0] || null;
    }

    static async create(employeeData) {
        const {
            first_name, last_name, middle_name, email, phone,
            department_id, position_id, manager_id, hire_date,
            employment_type, salary, date_of_birth, gender,
            marital_status, nationality, address, city, state,
            zip_code, country, sss_number, philhealth_number,
            pagibig_number, tin_number, emergency_contact_name,
            emergency_contact_relationship, emergency_contact_phone,
            bank_name, bank_account_number, notes
        } = employeeData;

        const employee_code = generateEmployeeCode();

        const [result] = await pool.execute(
            `INSERT INTO employees (
                employee_code, first_name, last_name, middle_name, email, phone,
                department_id, position_id, manager_id, hire_date,
                employment_type, salary, date_of_birth, gender,
                marital_status, nationality, address, city, state,
                zip_code, country, sss_number, philhealth_number,
                pagibig_number, tin_number, emergency_contact_name,
                emergency_contact_relationship, emergency_contact_phone,
                bank_name, bank_account_number, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                employee_code, first_name, last_name, middle_name, email, phone,
                department_id, position_id, manager_id, hire_date,
                employment_type, salary, date_of_birth, gender,
                marital_status, nationality, address, city, state,
                zip_code, country, sss_number, philhealth_number,
                pagibig_number, tin_number, emergency_contact_name,
                emergency_contact_relationship, emergency_contact_phone,
                bank_name, bank_account_number, notes
            ]
        );

        return this.findById(result.insertId);
    }

    static async update(id, employeeData) {
        const allowedFields = [
            'first_name', 'last_name', 'middle_name', 'email', 'phone',
            'alternate_phone', 'department_id', 'position_id', 'manager_id',
            'hire_date', 'employment_type', 'employment_status', 'salary',
            'date_of_birth', 'gender', 'marital_status', 'nationality',
            'address', 'city', 'state', 'zip_code', 'country',
            'sss_number', 'philhealth_number', 'pagibig_number', 'tin_number',
            'emergency_contact_name', 'emergency_contact_relationship',
            'emergency_contact_phone', 'bank_name', 'bank_account_number',
            'notes', 'probation_end_date', 'regularization_date'
        ];

        const updateFields = [];
        const updateValues = [];

        for (const [key, value] of Object.entries(employeeData)) {
            if (allowedFields.includes(key)) {
                updateFields.push(`${key} = ?`);
                updateValues.push(value);
            }
        }

        if (updateFields.length === 0) {
            throw new Error('No valid fields to update');
        }

        updateValues.push(id);
        
        await pool.execute(
            `UPDATE employees SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        return this.findById(id);
    }

    static async delete(id) {
        // Soft delete - just update status
        await pool.execute(
            'UPDATE employees SET employment_status = ? WHERE id = ?',
            ['terminated', id]
        );
        return true;
    }

    static async hardDelete(id) {
        const [result] = await pool.execute('DELETE FROM employees WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async getEmployeeStats() {
        const query = `
            SELECT 
                COUNT(*) as total_employees,
                SUM(CASE WHEN employment_status = 'active' THEN 1 ELSE 0 END) as active_employees,
                SUM(CASE WHEN employment_type = 'full-time' THEN 1 ELSE 0 END) as full_time,
                SUM(CASE WHEN employment_type = 'part-time' THEN 1 ELSE 0 END) as part_time,
                SUM(CASE WHEN employment_type = 'contract' THEN 1 ELSE 0 END) as contract,
                COUNT(DISTINCT department_id) as total_departments,
                AVG(salary) as average_salary
            FROM employees
            WHERE employment_status != 'terminated'
        `;
        const [rows] = await pool.execute(query);
        return rows[0];
    }

    static async getDepartmentDistribution() {
        const query = `
            SELECT d.name, COUNT(e.id) as count
            FROM departments d
            LEFT JOIN employees e ON d.id = e.department_id AND e.employment_status = 'active'
            GROUP BY d.id, d.name
            ORDER BY count DESC
        `;
        const [rows] = await pool.execute(query);
        return rows;
    }
}

module.exports = EmployeeModel;