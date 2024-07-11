// C:\Users\DEEPSROCK\Desktop\node-js\Expense tracker\routes\premiumRoutes.js
const express = require('express');
const authenticatemiddleware = require('../middleware/auth');
const router = express.Router();

// Get user premium status
router.get('/getPremiumStatus', authenticatemiddleware.authenticate, (req, res) => {
    const isPremium = req.user.isPremiumUser || false;
    res.json({ isPremium });
});

module.exports = router;
