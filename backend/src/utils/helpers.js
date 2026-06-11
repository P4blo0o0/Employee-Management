/**
 * Generate employee code
 */
const generateEmployeeCode = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `EMP${year}${random}`;
};

/**
 * Format date to YYYY-MM-DD
 */
const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
};

/**
 * Calculate age from date of birth
 */
const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

/**
 * Calculate probation end date (6 months from hire date)
 */
const calculateProbationEnd = (hireDate) => {
    const hire = new Date(hireDate);
    hire.setMonth(hire.getMonth() + 6);
    return formatDate(hire);
};

/**
 * Sanitize phone number (keep only digits)
 */
const sanitizePhone = (phone) => {
    if (!phone) return null;
    return phone.replace(/[^\d+]/g, '');
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Pagination helper
 */
const getPaginationParams = (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = query.search || '';
    const sortBy = query.sortBy || 'created_at';
    const sortOrder = query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    return { page, limit, offset, search, sortBy, sortOrder };
};

module.exports = {
    generateEmployeeCode,
    formatDate,
    calculateAge,
    calculateProbationEnd,
    sanitizePhone,
    isValidEmail,
    getPaginationParams
};