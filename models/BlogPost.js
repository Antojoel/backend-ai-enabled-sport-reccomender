// models/BlogPost.js
const pool = require('../db');

// Create a new blog post
async function createPost(title, content, user_id, category) {
    const query = `
    INSERT INTO blog_posts (title, content, user_id, category, created_at, updated_at)
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    RETURNING *
  `;
    const values = [title, content, user_id, category];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

// Get all blog posts
async function getAllPosts() {
    const query = `
    SELECT bp.*, u.username as author_name
    FROM blog_posts bp
    JOIN users u ON bp.user_id = u.id
    ORDER BY bp.created_at DESC
  `;
    const { rows } = await pool.query(query);
    return rows;
}

// Get blog post by ID
async function getPostById(id) {
    const query = `
    SELECT bp.*, u.username as author_name
    FROM blog_posts bp
    JOIN users u ON bp.user_id = u.id
    WHERE bp.id = $1
  `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
}

// Update a blog post
async function updatePost(id, title, content, category) {
    const query = `
    UPDATE blog_posts
    SET title = $1, content = $2, category = $3, updated_at = NOW()
    WHERE id = $4
    RETURNING *
  `;
    const values = [title, content, category, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

// Delete a blog post
async function deletePost(id) {
    const query = 'DELETE FROM blog_posts WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
}

// Search posts by title or content
async function searchPosts(searchTerm) {
    const query = `
    SELECT bp.*, u.username as author_name
    FROM blog_posts bp
    JOIN users u ON bp.user_id = u.id
    WHERE bp.title ILIKE $1 OR bp.content ILIKE $1 OR bp.category ILIKE $1
    ORDER BY bp.created_at DESC
  `;
    const { rows } = await pool.query(query, [`%${searchTerm}%`]);
    return rows;
}

async function getRecentPosts(limit = 5) {
    const query = `
      SELECT bp.*, u.username as author_name
      FROM blog_posts bp
      JOIN users u ON bp.user_id = u.id
      ORDER BY bp.created_at DESC
      LIMIT $1
    `;
    const { rows } = await pool.query(query, [limit]);
    return rows;
}

// Update the exports
module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    searchPosts,
    getRecentPosts
};