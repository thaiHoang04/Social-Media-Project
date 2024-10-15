const express = require('express');
const {
    getPendingGroups,
    getAllGroups,
    resumeUser,
    suspendUser,
    approveGroup,
    deletePostByAdmin,
    deleteCommentByAdmin,
    deleteGroup
} = require('../controllers/adminController');
const {protect} = require('../middleware/authMiddleware');
const {isAdmin} = require('../middleware/adminMiddleware');

const router = express.Router();


// Route to fetch all groups (approved and unapproved)
router.get('/groups', protect, isAdmin, getAllGroups);

// Route to fetch only unapproved group (pending)
router.get('/groups/pending', protect, isAdmin, getPendingGroups);

// Route to approve group
router.put('/groups/:id/approve', protect, isAdmin, approveGroup);

// Route to delete group
router.delete('/groups/:id', protect, isAdmin, deleteGroup);

// Route to suspend user
router.put('/users/:id/suspend', protect, isAdmin, suspendUser);

// Route to resume user
router.put('/users/:id/resume', protect, isAdmin, resumeUser);

// Route to delete post
router.delete('/posts/:id', protect, isAdmin, deletePostByAdmin);

// Route to delete comments
router.delete('/posts/:postId/comments/:commentId', protect, isAdmin, deleteCommentByAdmin);


module.exports = router;
