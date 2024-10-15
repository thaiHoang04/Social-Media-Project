const express = require('express');
const {
    createPost,
    getPosts,
    updatePost,
    deletePost,
    reactionOnPost,
    getCommentsForPost,
    commentOnPost,
    deletePostByAdmin,
    deleteCommentByAdmin,
    getPostsById,
    getAllPosts,
} = require('../controllers/postController');
const {protect} = require('../middleware/authMiddleware');
const {isAdmin} = require('../middleware/adminMiddleware');

const router = express.Router();

// Route to create a post
router.post('/create', protect, createPost);

// Route to get posts
router.get('/', protect, getPosts); // Use root ('/') to be consistent with your other API routes

// Route to get post by ID
router.get('/get/:id', getPostsById)

// Route to get all posts
router.get('/get', protect, getAllPosts)

// Route to update a post
router.put('/:postId', protect, updatePost);

// Route to delete a post
router.delete('/:postId', protect, deletePost);

// Route to like a post
router.put('/reactions/:postId', protect, reactionOnPost); // Test without protect

router.post('/:postId/comments', protect, commentOnPost)

// Route to comment on a post
router.get('/:postId/comments', protect, getCommentsForPost);  // New route to fetch comments for a post

// Route to delete a post by an admin
router.delete('/:postId/admin', protect, isAdmin, deletePostByAdmin); // Admin deletion route

// Route to delete a comment by an admin
router.delete('/comments/:commentId/admin', protect, isAdmin, deleteCommentByAdmin); // Admin comment deletion route

module.exports = router;
