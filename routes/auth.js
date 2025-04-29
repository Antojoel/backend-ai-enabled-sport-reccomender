// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' }); // Change to 409
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.createUser(username, email, hashedPassword, role);

    return res.status(200).json({ message: 'User created successfully', user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error during signup' });
  }
});

module.exports = router;


// POST /api/auth/signin
router.post('/signin', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  try {
    // Query to find the user by email
    const user = await User.findUserByEmail(email); // Use findUserByEmail instead of findOne

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the provided password matches the stored password
    const isPasswordValid = await bcrypt.compare(password, user.password); // Use bcrypt.compare

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Check if the user's role matches the expected role
    if (user.role !== role) {
      return res.status(403).json({ message: 'Role mismatch' });
    }

    // Send the response on successful login
    return res.status(200).json({ message: 'Signin successful', user: user });

  } catch (error) {
    console.error('Error during signin:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
