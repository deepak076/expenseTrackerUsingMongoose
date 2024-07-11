// C:\Users\DEEPSROCK\Desktop\node-js\Expense tracker\routes\expenseRoutes.js
const express = require('express');
const expenseController = require('../controllers/expenseController');
const router = express.Router();
const userauthenticate = require('../middleware/auth');

router.post('/addExpense',userauthenticate.authenticate, expenseController.addExpense);
router.get('/getExpenses', userauthenticate.authenticate, expenseController.getExpenses);
router.delete('/deleteExpense/:expenseId', userauthenticate.authenticate, expenseController.deleteExpense);
router.get('/download', userauthenticate.authenticate, expenseController.downloadExpenses)
router.get('/downloadedFiles', userauthenticate.authenticate, expenseController.getDownloadedFiles);

module.exports = router;
