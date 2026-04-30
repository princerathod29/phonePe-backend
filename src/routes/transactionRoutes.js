const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sendMoney, getTransactionHistory } = require('../controllers/transactionController');

router.post('/send', protect, sendMoney);
router.get('/history', protect, getTransactionHistory);

module.exports = router;
