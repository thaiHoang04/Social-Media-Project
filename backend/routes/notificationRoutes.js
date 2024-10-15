const express = require('express');
const {
    createNotification,
    getNotificationsByUserID,
    getNotificationByUserIDAndSenderID
} = require("../controllers/notificationController");
const {acceptFriendRequest, rejectFriendRequest, approveGroupRequest} = require("../controllers/userController");
const {protect} = require("../middleware/authMiddleware");
const router = express.Router();

// Route to create a notification
router.post('/create/:receiverID', protect, createNotification)

// Route to get notification by user ID and sender ID
router.get('/check/:senderID/:receiverID', protect, getNotificationByUserIDAndSenderID)

// Route to get notifications by user ID
router.get('/get/:receiverID', protect, getNotificationsByUserID)

// Route to accept friend request
router.put('/friend/accept/:receiverID/:senderID', protect, acceptFriendRequest)

// Route to reject friend request
router.put('/friend/reject/:receiverID/:senderID', protect, rejectFriendRequest)

// Route to approve group request
router.put('/admin/group/approve/:groupAuthorID/:adminID', protect, approveGroupRequest)

module.exports = router;
