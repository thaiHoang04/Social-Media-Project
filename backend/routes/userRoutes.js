const express = require('express');
const {getUserProfile, suspendUser, getUsers} = require('../controllers/userController');
const {protect} = require('../middleware/authMiddleware');
const {isAdmin} = require('../middleware/adminMiddleware');

const router = express.Router();

// Route to get all users
router.get('/users', protect, isAdmin, getUsers); // Get all users (admin only)

// Route to get all users
router.get('/users/byuser', protect, getUsers);

// Route to get the profile of the logged-in user
router.get('/profile', protect, getUserProfile); // Get the profile of the logged-in user

// Route to suspend a user
router.put('/:userId/suspend', protect, isAdmin, suspendUser); // Suspend a user (admin only)

module.exports = router;
