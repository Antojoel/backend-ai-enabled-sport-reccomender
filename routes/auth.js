// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Replace with secure key in production

// Route for user signup
router.post('/signup', async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.createUser(username, email, hashedPassword, role);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email,
        role: newUser.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Return user data and token
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      token: token
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route for user signin
router.post('/signin', async (req, res) => {

  console.log(req)
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  try {
    // Query to find the user by email
    const user = await User.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the provided password matches the stored password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Check if the user's role matches the expected role
    if (user.role !== role) {
      return res.status(403).json({ message: 'Role mismatch' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Send the response on successful login
    return res.status(200).json({ 
      message: 'Signin successful', 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token: token
    });

  } catch (error) {
    console.error('Error during signin:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;