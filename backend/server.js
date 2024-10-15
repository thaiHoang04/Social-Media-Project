const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {LocalStorage} = require('node-localstorage');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Create an express app
const app = express();

// Set the port
const PORT = process.env.PORT || 5000;

// Create a local storage
const localStorage = new LocalStorage('./scratch');

// Import all used routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const friendRoutes = require('./routes/friendRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const groupRoutes = require('./routes/groupRoutes');
const historyRoutes = require('./routes/historyRoutes');

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

//Listen for connection events
mongoose.connection.on('connected', () => {
    if (localStorage.getItem('token')) {
        localStorage.getItem('queuedReactions').forEach(async (item) => {
            await fetch(item.url, {
                method: item.method,
                body: JSON.stringify(item.body),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
        })
        localStorage.removeItem('queuedReactions')
    }
});

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes)
app.use('/api', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/groups', groupRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Listen on the port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app
