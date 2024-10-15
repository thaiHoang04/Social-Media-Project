const express = require('express');
const {
    createGroup,
    getAllGroup,
    getGroupsOfUser,
    getGroupsNotJoinOfUser,
    getGroupById,
    addMemberToRequestList,
    removeMember,
    addMember,
    addMemberFromRequestListToGroup,
    removerUserFromRequestList,
    getAllMembers,
    getAllRequest,
    approveGroup,
    getAdmin
} = require("../controllers/groupController");
const {protect} = require('../middleware/authMiddleware');
const {isAdmin} = require('../middleware/adminMiddleware');

const router = express.Router();

// Create a new group
router.post('/creategroup', protect, createGroup);

// Get all groups
router.get('/', protect, getAllGroup);

// Get groups of a user
router.get('/:userId', protect, getGroupsOfUser);

// Get groups not joined by a user
router.get('/notjoin/:userId', protect, getGroupsNotJoinOfUser);

// Get group by ID
router.get('/get/:id', protect, getGroupById);

// Add members to the request list in a group
router.post('/:groupId/requests/:userId', protect, addMemberToRequestList);

// Remove a member from a group
router.delete('/:groupId/members/:memberId', protect, removeMember);

// Add members
router.post('/:groupId/:userId', protect, addMember);

// Add members from request list to a group
router.post('/:groupId/members/:userId', protect, addMemberFromRequestListToGroup);

// Remove users from request list
router.delete('/:groupId/requests/:userId', protect, removerUserFromRequestList);

// Get all members of a group
router.get('/:groupId/members', protect, getAllMembers);

// Get all requests of a group
router.get('/:groupId/requests', protect, getAllRequest);

// Approve a group
router.put('/approve/:groupId', protect, isAdmin, approveGroup);

// Get admin of a group
router.get('/admin/:groupID', protect, getAdmin);

module.exports = router;