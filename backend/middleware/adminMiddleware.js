// Middleware to check if user is admin or not
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({message: 'Admin access only'});
    }
};

module.exports = {isAdmin};
