const express = require('express');
const {getFriendInfoByID, unFriendByID, acceptFriendRequest} = require("../controllers/userController");
const {protect} = require("../middleware/authMiddleware");
const router = express.Router();

// Route to get friend info by ID
router.get('/:id', protect, getFriendInfoByID);

// Route to unfriend by ID
router.put('/unfriend/:id', protect, unFriendByID)

// Route to accept friend request
router.put('/accept/:receiverID/:senderID', protect, acceptFriendRequest)

module.exports = router;
