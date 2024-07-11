// // C:\Users\DEEPSROCK\Desktop\node-js\Expense tracker\models\expenseModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Expense schema
const expenseSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // Enable automatic timestamps
});

// Create the Expense model
const Expense = mongoose.model('Expense', expenseSchema);

// Create a new expense
const createExpense = async (amount, description, category, user_id) => {
  try {
    const newExpense = new Expense({ amount, description, category, user_id });
    const savedExpense = await newExpense.save();
    return savedExpense._id;
  } catch (err) {
    throw err;
  }
};

// Get all expenses for a user with pagination
const getAllExpenses = async (userId, offset, pageSize) => {
  try {
    const expenses = await Expense.find({ user_id: userId })
      .skip(offset)
      .limit(pageSize)
      .select('id amount description category');
    return expenses;
  } catch (error) {
    throw new Error(`Error fetching expenses: ${error.message}`);
  }
};

// Delete an expense by ID
const deleteExpense = async (expenseId) => {
  try {
    const result = await Expense.findByIdAndDelete(expenseId);
    return result;
  } catch (error) {
    throw new Error(`Error deleting expense: ${error.message}`);
  }
};

// Get paginated expenses for a user
const getPaginatedExpenses = async (userId, offset, pageSize) => {
  try {
    const expenses = await Expense.find({ user_id: userId })
      .skip(offset)
      .limit(pageSize)
      .select('id amount description category');
    return expenses;
  } catch (error) {
    throw new Error(`Error fetching paginated expenses: ${error.message}`);
  }
};

// Get total expenses count for a user
const getTotalExpensesCount = async (userId) => {
  try {
    const count = await Expense.countDocuments({ user_id: userId });
    return count;
  } catch (error) {
    throw new Error(`Error fetching total expenses count: ${error.message}`);
  }
};

// Get all expenses for a user to download
const getAllExpensesToDownload = async (userId) => {
  try {
    const expenses = await Expense.find({ user_id: userId })
      .select('id amount description category');
    return expenses;
  } catch (error) {
    throw new Error(`Error fetching all expenses: ${error.message}`);
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
  deleteExpense,
  getPaginatedExpenses,
  getTotalExpensesCount,
  getAllExpensesToDownload
};

