const mongoose = require('mongoose');

// Define the group schema
const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        default: 'pending',
    },
    visibility: {
        type: String,
        default: 'Public',
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    numberOfMembers: {
        type: Number,
        default: 0,
    },
    requestList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }],
    isApproved: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
