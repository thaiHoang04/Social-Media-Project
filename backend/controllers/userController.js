const User = require('../models/User');
const Notification = require('../models/Notification');

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}); // Fetch all users
        res.json(users);
    } catch (error) {
        res.status(500).json({message: 'Server error, could not fetch users'});
    }
};

// Get user profile
const getUserProfile = (req, res) => {
    // At this point, req.user should be populated by the protect middleware
    if (!req.user) {
        return res.status(404).json({message: 'User not found'});
    }

    res.json(req.user);
};

// Get the friend information by id
const getFriendInfoByID = async (req, res) => {
    try {
        // Find the friend by ID
        const friend = await User.findById(req.params.id);

        // If the friend is not found, return a 404 error
        if (!friend) {
            return res.status(404).json({message: 'Friend not found'});
        }
        res.json({
            friend: {
                _id: friend._id,
                username: friend.username,
                friends: friend.friends,
                groups: friend.groups,
                avatar: friend.avatar,
                email: friend.email,
                isAdmin: friend.isAdmin,
            }
        });
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

// Unfriend by ID
const unFriendByID = async (req, res) => {
    try {
        // Remove the friend from the user's friend list
        const response = await User.updateOne(
            {_id: req.body.userID},
            {$pull: {friends: req.params.id}}
        );

        // Remove the user from the friend's friend list
        const response2 = await User.updateOne(
            {_id: req.params.id},
            {$pull: {friends: req.body.userID}}
        )
        if (response && response2) {
            res.json({message: 'Unfriend successfully'});
        }
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}

// Accept friend request
const acceptFriendRequest = async (req, res) => {
    const {senderID, receiverID} = req.params

    try {
        // Find the sender
        const sender = await User.findById(senderID)

        // Find the receiver
        const receiver = await User.findById(receiverID)

        // If the sender or receiver is not found, return a 404 error
        if (!sender || !receiver) {
            return res.status(404).json({message: 'User not found'});
        }

        // Find the friend request
        const friendRequest = await Notification.findOne({
            senderID,
            receiverID,
            type: 'Friend Request'
        }).populate('senderID', 'username avatar')

        // If the friend request is not found, return a 404 error
        if (!friendRequest) {
            return res.status(404).json({message: 'Friend request not found'});
        }

        // Add the sender to the receiver's friend list
        receiver.friends = [...receiver.friends, senderID]

        // Add the receiver to the sender's friend list
        sender.friends = [...sender.friends, receiverID]

        await receiver.save()
        await sender.save()

        friendRequest.type = 'Friend Request Accepted'
        friendRequest.message = `You have accepted ${sender.username} friend request !`
        await Notification.updateOne({senderID, receiverID, type: 'Friend Request'}, {
            $set: {
                senderID: receiverID,
                receiverID: senderID,
                type: 'Friend Request Accepted',
                message: `${receiver.username} accepted your friend request !`
            }
        })

        res.json(friendRequest)
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}

// Reject the friend request
const rejectFriendRequest = async (req, res) => {
    const {senderID, receiverID} = req.params

    try {
        // Find the sender and receiver
        const sender = await User.findById(senderID)
        const receiver = await User.findById(receiverID)

        // If the sender or receiver is not found, return a 404 error
        if (!sender || !receiver) {
            return res.status(404).json({message: 'User not found'});
        }

        // Find the friend request
        const friendRequest = await Notification.findOne({
            senderID,
            receiverID,
            type: 'Friend Request'
        }).populate('senderID', 'username avatar')

        // If the friend request is not found, return a 404 error
        if (!friendRequest) {
            return res.status(404).json({message: 'Friend request not found'});
        }

        friendRequest.type = 'Friend Request Rejected'
        friendRequest.message = `You have rejected ${sender.username} friend request !`

        await Notification.updateOne({
            senderID,
            receiverID,
            type: 'Friend Request'
        }, {
            $set: {
                senderID: receiverID,
                receiverID: senderID,
                type: 'Friend Request Rejected',
                message: `${receiver.username} rejected your friend request !`
            }
        })

        res.json(friendRequest)
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }

}

// Approve group request
const approveGroupRequest = async (req, res) => {
    try {
        const groupAuthorId = req.params.groupID;
        const adminId = req.params.adminID;

        // Update the notification
        await Notification.updateOne({
                senderID: groupAuthorId,
                receiverID: adminId,
                type: 'Group Request'
            },
            {
                $set: {
                    senderId: adminId,
                    receiverId: groupAuthorId,
                    type: 'Create Group Request Accepted',
                    message: 'Your group request has been accepted'
                }
            });
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}

// Suspend user
const suspendUser = async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.params.userId);

        // If the user is not found, return a 404 error
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        // Toggle the suspension status
        user.isSuspended = !user.isSuspended; // Toggle suspension status
        await user.save();

        res.json({message: `User ${user.isSuspended ? 'suspended' : 'resumed'} successfully`, user});
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

module.exports = {
    getUserProfile,
    getFriendInfoByID,
    unFriendByID,
    getUsers,
    acceptFriendRequest,
    rejectFriendRequest,
    approveGroupRequest,
    suspendUser
};
  