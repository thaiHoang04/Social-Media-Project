const User = require('../models/User');
const generateToken = require('../utils/generateToken');


// Login User
const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        // Check if the user exists and the password is correct
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({message: 'Invalid email or password'});
        }

        // Check if the user is suspended
        if (user.isSuspended) {
            return res.status(403).json({message: 'Your account has been suspended. Please contact support.'});
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                friends: user.friends,
                groups: user.groups,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};


// Register User
const registerUser = async (req, res) => {
    const {username, email, password} = req.body;

    // Check if user exists
    try {
        const userExists = await User.findOne({email});

        if (userExists) {
            return res.status(400).json({message: 'User already exists'});
        }
        // Create new user
        const user = new User({username, email, password, isAdmin: false});
        await user.save();

        // Generate token for new user
        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                friends: user.friends,
                groups: user.groups,
                avatar: user.avatar,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        });
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};


module.exports = {loginUser, registerUser};
