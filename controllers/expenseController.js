// C:\Users\DEEPSROCK\Desktop\node-js\Expense tracker\controllers\expenseController.js
const expenseModel = require('../models/expenseModel');
const { User } = require('../models/userModel');
const s3Service = require('../services/s3services');
const { DownloadedFile } = require('../models/downloadFiles');
const { updateTotalExpenses } = require('../models/userModel');


const addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const userId = req.user._id; // Mongoose uses _id

    const expenseId = await expenseModel.createExpense(amount, description, category, userId);
    const newExpense = { id: expenseId, amount, description, category };

    await updateTotalExpenses(userId);

    res.json({ success: true, expense: newExpense });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const totalExpenses = await expenseModel.getTotalExpensesCount(userId);

    const offset = (page - 1) * pageSize;
    const expenses = await expenseModel.getPaginatedExpenses(userId, offset, pageSize);

    res.json({ totalExpenses, pageSize, expenses });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const userId = req.user._id;
    const expenseId = req.params.expenseId;

    await expenseModel.deleteExpense(expenseId);
    await updateTotalExpenses(userId);

    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const downloadExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    const expenses = await expenseModel.getAllExpensesToDownload(userId);
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `Expense${userId}/${new Date().toISOString()}.txt`;

    const downloadUrl = await s3Service.uploadToS3(stringifiedExpenses, filename);

    await DownloadedFile.create({ user_id: userId, file_url: downloadUrl });

    res.status(200).json({ downloadUrl, success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Error generating pre-signed URL' });
  }
};

const getDownloadedFiles = async (req, res) => {
  try {
    const userId = req.user._id;

    const downloadedFiles = await DownloadedFile.find({ user_id: userId })
      .select('id file_url download_date')
      .sort({ download_date: -1 });

    res.json({ success: true, downloadedFiles });
  } catch (error) {
    console.error('Error fetching downloaded files:', error);
    res.status(500).json({ success: false, error: 'Error fetching downloaded files' });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense,
  downloadExpenses,
  getDownloadedFiles,
};
