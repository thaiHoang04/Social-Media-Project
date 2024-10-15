const jwt = require('jsonwebtoken');


// Function to generate token

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

module.exports = generateToken;
