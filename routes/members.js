// routes/members.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Don't return the password
        const { password, ...userWithoutPassword } = user;

        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    const { username, email } = req.body;

    try {
        const updatedUser = await User.updateUser(req.user.id, username, email);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Don't return the password
        const { password, ...userWithoutPassword } = updatedUser;

        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get recent blog posts for dashboard
router.get('/dashboard/posts', authenticateToken, async (req, res) => {
    try {
        const posts = await BlogPost.getRecentPosts(5); // Get 5 most recent posts
        res.json(posts);
    } catch (error) {
        console.error('Error fetching recent posts:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;