const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { addStatus, getStatuses } = require('../controllers/statusController');

const router = express.Router();

router.route('/').post(protect, addStatus).get(protect, getStatuses);

module.exports = router;
