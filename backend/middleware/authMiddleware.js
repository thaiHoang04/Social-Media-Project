const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Extract the token

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the user associated with the token
            req.user = await User.findById(decoded.userId).select('-password');

            if (!req.user) {
                return res.status(404).json({message: 'User not found'});
            }

            next();
        } catch (error) {
            console.error('Error in protect middleware:', error.message);
            return res.status(401).json({message: `Not authorized, token failed: ${error.message}`});
        }
    } else {
        res.status(401).json({message: 'Not authorized, no token'});
    }
};

module.exports = {protect};
