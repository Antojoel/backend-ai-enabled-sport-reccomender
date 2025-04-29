const express = require("express");
const cors = require("cors");
const pool = require("./db");  // Import pool from db.js
require("dotenv").config(); // Load environment variables from the config.env file

// Import routes
const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/members');
const blogPostRoutes = require('./routes/blogPosts');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/posts', blogPostRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Test PostgreSQL connection
pool.connect()
  .then(() => {
    console.log("Connected to PostgreSQL!");
  })
  .catch(err => {
    console.error("Error connecting to PostgreSQL:", err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});