const { pool } = require('../config/database');

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Insert Departments
        const departments = [
            ['Information Technology', 'IT', 'Technology and Systems Department'],
            ['Human Resources', 'HR', 'Human Resources Management'],
            ['Finance', 'FIN', 'Finance and Accounting'],
            ['Marketing', 'MKT', 'Marketing and Communications'],
            ['Operations', 'OPS', 'Business Operations'],
            ['Sales', 'SAL', 'Sales Department']
        ];

        for (const [name, code, description] of departments) {
            await pool.execute(
                'INSERT IGNORE INTO departments (name, code, description) VALUES (?, ?, ?)',
                [name, code, description]
            );
        }

        // Insert Positions
        const positions = [
            ['Software Developer', 'DEV', 1, 30000.00, 80000.00],
            ['System Administrator', 'SYSAD', 1, 35000.00, 90000.00],
            ['HR Manager', 'HRM', 2, 40000.00, 100000.00],
            ['HR Specialist', 'HRS', 2, 25000.00, 50000.00],
            ['Accountant', 'ACC', 3, 30000.00, 70000.00],
            ['Finance Manager', 'FINM', 3, 50000.00, 120000.00],
            ['Marketing Specialist', 'MKTS', 4, 25000.00, 60000.00],
            ['Operations Manager', 'OPM', 5, 45000.00, 110000.00],
            ['Sales Representative', 'SALR', 6, 20000.00, 45000.00],
            ['Sales Manager', 'SALM', 6, 50000.00, 130000.00]
        ];

        for (const [title, code, deptId, min, max] of positions) {
            await pool.execute(
                'INSERT IGNORE INTO positions (title, code, department_id, salary_range_min, salary_range_max) VALUES (?, ?, ?, ?, ?)',
                [title, code, deptId, min, max]
            );
        }

        // Insert Sample Employees
        const sampleEmployees = [
            {
                employee_code: 'EMP001',
                first_name: 'Juan',
                last_name: 'Dela Cruz',
                email: 'juan.delacruz@company.com',
                phone: '+639123456789',
                department_id: 1,
                position_id: 1,
                hire_date: '2023-01-15',
                employment_type: 'full-time',
                employment_status: 'active',
                salary: 55000.00,
                date_of_birth: '1990-05-15',
                gender: 'male',
                marital_status: 'single',
                sss_number: '12-3456789-0',
                philhealth_number: '12-345678901-2',
                pagibig_number: '1234-5678-9012',
                tin_number: '123-456-789-000',
                address: '123 Rizal St., Makati City',
                city: 'Makati',
                state: 'Metro Manila',
                zip_code: '1200',
                emergency_contact_name: 'Maria Dela Cruz',
                emergency_contact_relationship: 'Mother',
                emergency_contact_phone: '+639987654321'
            },
            {
                employee_code: 'EMP002',
                first_name: 'Maria',
                last_name: 'Santos',
                email: 'maria.santos@company.com',
                phone: '+639234567890',
                department_id: 2,
                position_id: 3,
                hire_date: '2023-03-01',
                employment_type: 'full-time',
                employment_status: 'active',
                salary: 75000.00,
                date_of_birth: '1988-08-22',
                gender: 'female',
                marital_status: 'married',
                address: '456 Aguinaldo St., Quezon City',
                city: 'Quezon City',
                state: 'Metro Manila',
                zip_code: '1100',
            },
            {
                employee_code: 'EMP003',
                first_name: 'Pedro',
                last_name: 'Garcia',
                email: 'pedro.garcia@company.com',
                phone: '+639345678901',
                department_id: 3,
                position_id: 5,
                hire_date: '2023-06-15',
                employment_type: 'probationary',
                employment_status: 'active',
                salary: 35000.00,
                date_of_birth: '1995-12-10',
                gender: 'male',
                marital_status: 'single',
                address: '789 Mabini St., Pasig City',
                city: 'Pasig',
                state: 'Metro Manila',
                zip_code: '1600',
            }
        ];

        for (const emp of sampleEmployees) {
            const columns = Object.keys(emp).join(', ');
            const placeholders = Object.keys(emp).map(() => '?').join(', ');
            const values = Object.values(emp);
            
            await pool.execute(
                `INSERT IGNORE INTO employees (${columns}) VALUES (${placeholders})`,
                values
            );
        }

        console.log('✅ Database seeded successfully!');
        console.log(`   - ${departments.length} departments`);
        console.log(`   - ${positions.length} positions`);
        console.log(`   - ${sampleEmployees.length} sample employees`);

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        throw error;
    }
};

// Run seeder if called directly
if (require.main === module) {
    seedDatabase()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

module.exports = seedDatabase;