const mongoose = require('mongoose');

// Define the post schema
const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    visibility: {
        type: String,
        enum: ['Public', 'Friends'], // Define allowed visibility types
        default: 'Public',
    },
    imageStatus: {
        type: String, // URL of the image, optional
    },
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    love: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    funny: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    sad: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    angry: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        content: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }],
    groupId: {
        type: String,
        default: "None",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
