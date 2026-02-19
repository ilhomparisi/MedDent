import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

// Login admin user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find admin user
    const admin = await AdminUser.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!admin.is_active) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Compare password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    admin.last_login = new Date();
    await admin.save();

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const token = jwt.sign(
      { userId: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: admin._id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get current session
export const getSession = async (req, res) => {
  try {
    // This middleware already verified the token and set req.user
    res.json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email
      }
    });
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({ error: 'Failed to get session' });
  }
};

// Logout (client-side token removal, but we can track it)
export const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};
