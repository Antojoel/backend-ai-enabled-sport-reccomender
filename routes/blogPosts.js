// routes/blogPosts.js
const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const { authenticateToken, isAdminOrStaff } = require('../middleware/auth');

// Get all blog posts (public)
router.get('/', async (req, res) => {
    try {
        const posts = await BlogPost.getAllPosts();
        res.json(posts);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get blog post by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const post = await BlogPost.getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Search blog posts (public)
router.get('/search', async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const posts = await BlogPost.searchPosts(q);
        res.json(posts);
    } catch (error) {
        console.error('Error searching blog posts:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new blog post (admin/staff only)
router.post('/', authenticateToken, isAdminOrStaff, async (req, res) => {
    const { title, content, category } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    try {
        const newPost = await BlogPost.createPost(title, content, req.user.id, category);
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a blog post (admin/staff only)
router.put('/:id', authenticateToken, isAdminOrStaff, async (req, res) => {
    const { title, content, category } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    try {
        // First check if post exists
        const post = await BlogPost.getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Update the post
        const updatedPost = await BlogPost.updatePost(req.params.id, title, content, category);
        res.json(updatedPost);
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a blog post (admin/staff only)
router.delete('/:id', authenticateToken, isAdminOrStaff, async (req, res) => {
    try {
        // First check if post exists
        const post = await BlogPost.getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Delete the post
        const deletedPost = await BlogPost.deletePost(req.params.id);
        res.json({ message: 'Blog post deleted successfully', deletedPost });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;