// C:\Users\DEEPSROCK\Desktop\node-js\Expense tracker\routes\forgotpasswordRoutes.js
const express = require('express');
const resetpasswordController = require('../controllers/resetpasswordController');

const router = express.Router();

router.post('/forgotpassword', resetpasswordController.forgotpassword);
router.get('/resetpassword/:id', resetpasswordController.validateResetLink);
router.post('/resetpassword/:id', resetpasswordController.resetPassword);

module.exports = router;
