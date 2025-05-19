// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Auth
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Profile
router.get('/:id', userController.getProfile);
router.put('/:id', userController.updateProfile);

// Seed
router.post('/seed-users', userController.seedUsers);

module.exports = router;
