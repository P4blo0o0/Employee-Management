const app = require('./src/app');
const { testConnection } = require('./src/config/database');
const seedDatabase = require('./src/seeds/seedData');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Test database connection
        const isConnected = await testConnection();
        
        if (!isConnected) {
            console.error('❌ Failed to connect to database. Server not started.');
            process.exit(1);
        }

        // Auto-seed database if needed (optional)
        if (process.env.AUTO_SEED === 'true') {
            await seedDatabase();
        }

        // Start server
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
            console.log(`👥 Employees API: http://localhost:${PORT}/api/employees`);
            console.log(`🏢 Departments API: http://localhost:${PORT}/api/departments`);
            console.log(`💼 Positions API: http://localhost:${PORT}/api/positions`);
            console.log('='.repeat(50));
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();