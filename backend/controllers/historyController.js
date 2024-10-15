const History = require('../models/EditHistory');

// Create edit history
const createEditHistory = async (req, res) => {
    const {postId, changes} = req.body;
    try {
        const newHistory = new History({postId, changes});
        await newHistory.save();
        res.status(201).json(newHistory);
    } catch (error) {
        console.error('Error creating edit history:', error);
        res.status(500).json({error: error.message});
    }
}

// Get edit history
const getEditHistory = async (req, res) => {
    const {postId} = req.params;
    try {
        const historyEntries = await History.find({postId}).sort({timestamp: -1});
        res.status(200).json(historyEntries);
    } catch (error) {
        console.error('Error fetching edit history:', error);
        res.status(500).json({error: error.message});
    }
};

module.exports = {createEditHistory, getEditHistory};
