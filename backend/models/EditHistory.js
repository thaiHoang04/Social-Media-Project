const mongoose = require('mongoose');

// Define the history schema
const historySchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    changes: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const History = mongoose.model('History', historySchema);

module.exports = History;