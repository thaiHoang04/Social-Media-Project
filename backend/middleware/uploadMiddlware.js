const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatars'); // Directory where avatars will be stored
    },
    filename: function (req, file, cb) {
        cb(null, `${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024}, // Limit file size to 5MB
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    },
});

module.exports = upload;

