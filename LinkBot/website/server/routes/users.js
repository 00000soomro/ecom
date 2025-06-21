const express = require('express');
const User = require('../models/User');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Get all users (for super admin)
router.get('/', authMiddleware(['super_admin']), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user's profile
router.get('/profile', authMiddleware(['super_admin', 'agency', 'client']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update current user's profile
router.put('/profile', authMiddleware(['super_admin', 'agency', 'client']), async (req, res) => {
  const { firstName, lastName, phone, address, profilePicture, password } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (firstName) user.profile.firstName = firstName;
    if (lastName) user.profile.lastName = lastName;
    if (phone) user.profile.phone = phone;
    if (address) user.profile.address = address;
    if (profilePicture) user.profile.profilePicture = profilePicture;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;