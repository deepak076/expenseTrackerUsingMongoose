const express = require('express');
const purchaseController = require('../controllers/purchaseController');

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/premiummembership', authenticatemiddleware.authenticate, purchaseController.purchasepremium);

router.post('/updatetransactionstatus', authenticatemiddleware.authenticate, purchaseController.updateTransactionStatus)

router.get('/premiumleaderboard', authenticatemiddleware.authenticate, purchaseController.getPremiumLeaderboard);


module.exports = router;
