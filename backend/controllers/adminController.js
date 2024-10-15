const User = require('../models/User');
const Post = require('../models/Post');
const Group = require('../models/Group');
const {isValidObjectId} = require('mongoose');

// Suspend User
const suspendUser = async (req, res) => {
    try {
        console.log('User ID:', req.params.id);
        const user = await User.findById(req.params.id);
        if (user) {
            user.isSuspended = true;
            await user.save();
            res.json({message: 'User suspended successfully'});
        } else {
            res.status(404).json({message: 'User not found'});
        }
    } catch (error) {
        console.error('Error suspending user:', error);
        res.status(500).json({message: 'Server error'});
    }
};

// Resume User
const resumeUser = async (req, res) => {
    try {
        console.log('Resuming User ID:', req.params.id);
        const user = await User.findById(req.params.id);
        if (user) {
            user.isSuspended = false;
            await user.save();
            res.json({message: 'User resumed successfully'});
        } else {
            res.status(404).json({message: 'User not found'});
        }
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};


// Approve Group
const approveGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({message: 'Group not found'});
        }

        group.isApproved = true;
        group.status = 'Approved';
        await group.save();

        res.json({message: 'Group approved successfully', group});
    } catch (error) {
        console.error('Error approving group:', error);
        res.status(500).json({message: 'Server error'});
    }
};

// Delete Group
const deleteGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const group = await Group.findByIdAndDelete(groupId);

        if (!group) {
            return res.status(404).json({message: 'Group not found'});
        }

        return res.status(200).json({message: 'Group deleted successfully'});
    } catch (error) {
        console.error('Error deleting group:', error.message);
        return res.status(500).json({message: 'Failed to delete group'});
    }
};


// Fetch all groups (approved and unapproved)
const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.json(groups);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch groups'});
    }
};

// Fetch only unapproved groups
const getPendingGroups = async (req, res) => {
    try {
        const groups = await Group.find({isApproved: false});
        res.json(groups);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch pending groups'});
    }
};


// Delete Posts
const deletePostByAdmin = async (req, res) => {
    try {
        const postId = req.params.id;
        console.log('Post ID:', postId);

        if (!isValidObjectId(postId)) {
            return res.status(400).json({message: 'Invalid post ID format'});
        }

        const post = await Post.findById(postId);
        if (post) {
            await post.deleteOne();
            res.json({message: 'Post deleted successfully'});
        } else {
            res.status(404).json({message: 'Post not found'});
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({message: 'Server error'});
    }
};

// Delete Comments
const deleteCommentByAdmin = async (req, res) => {
    try {
        const {postId, commentId} = req.params;

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({message: 'Post not found'});
        }

        // Find and delete the comment
        const comment = await Post.updateOne({_id: postId}, {$pull: {comments: {_id: commentId}}});
        if (!comment) {
            return res.status(404).json({message: 'Comment not found'});
        }

        post.comments = post.comments.filter((c) => c._id.toString() !== commentId);
        await post.save();

        return res.status(200).json({message: 'Comment deleted successfully'});
    } catch (error) {
        console.error('Error deleting comment:', error.message);
        return res.status(500).json({message: 'Failed to delete comment'});
    }
};


module.exports = {
    suspendUser,
    resumeUser,
    approveGroup,
    getAllGroups,
    getPendingGroups,
    deletePostByAdmin,
    deleteCommentByAdmin,
    deleteGroup,
};
