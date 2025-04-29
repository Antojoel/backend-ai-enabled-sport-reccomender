const express = require("express");
const cors = require("cors");
const pool = require("./db");  // Import pool from db.js
require("dotenv").config(); // Load environment variables from the config.env file
const auth = require('./routes/auth');
const members = require('./routes/members');
const blogPosts = require('./routes/blogPosts');
const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/auth', auth);
app.use('/api/members', members);
app.use('/api/posts', blogPosts);
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
