const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = function (req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]; // Expecting 'Bearer <token>'
    if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

    try {
        const verified = jwt.verify(token, process.env.APP_JWT_SECRET);
        console.log(verified);
        if (!verified.isAdmin) {
            return res.status(403).json({ message: 'Access Denied. Not an admin.' });
        }
        req.user = verified;
        next();
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: 'Invalid Token '  });
    }
};

