// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use environment variable in production

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
}

// Middleware to check if user is admin or staff
function isAdminOrStaff(req, res, next) {
    if (req.user.role === 'admin' || req.user.role === 'staff') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admin or Staff access required' });
    }
}

// Middleware to check if user is admin
function isAdmin(req, res, next) {
    if (req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
}

module.exports = {
    authenticateToken,
    isAdminOrStaff,
    isAdmin
};