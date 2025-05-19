// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // Implement token generation here (JWT or session)
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.seedUsers = async (req, res) => {
  try {
    console.log("🔥 Seeding started");

    const users = [
      { name: 'Alice Smith', email: 'alice@example.com', password: 'password123', role: 'client' },
      { name: 'Bob Johnson', email: 'bob@example.com', password: 'mypassword', role: 'staff' },
      { name: 'Charlie Brown', email: 'charlie@example.com', password: 'charliepass', role: 'admin' },
      { name: 'Diana Prince', email: 'diana@example.com', password: 'wonderwoman', role: 'client' },
    ];

    for (const u of users) {
      const existing = await User.findOne({ email: u.email });
      if (existing) {
        console.log('⚠️ Skipping existing user: ${u.email}');
        continue;
      }

      const hashedPassword = await bcrypt.hash(u.password, 10);
      const user = new User({
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role,
      });

      await user.save();
      console.log(`✅ Created user: ${u.email}`);
    }

    res.json({ message: 'Sample users seeded successfully!' });
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    res.status(500).json({ error: err.message });
  }
};
