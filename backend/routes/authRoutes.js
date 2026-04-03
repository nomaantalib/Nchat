const express = require('express');
const { registerUser, authUser, searchUsers, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/users', protect, searchUsers);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updateProfile);

module.exports = router;
