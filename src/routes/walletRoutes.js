const express = require('express');
const router = express.Router();
const { addMoney, payBill } = require('../controllers/walletTxn');
const {protect} = require('../middleware/authMIddleware');

router.post('/add-money', protect, addMoney);
router.post('/pay-bill', protect, payBill);

module.exports = router;