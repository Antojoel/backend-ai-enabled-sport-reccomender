// Add this to the top of routes/auth.js after the existing imports
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Replace with secure key in production

// Modify your signin route to generate JWT token
router.post('/signin', async (req, res) => {
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