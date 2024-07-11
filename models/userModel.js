// models\userModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Expense = require('./expenseModel');

// Define the User schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isPremiumUser: {
    type: Boolean,
    default: false // Set the default value to false
  },
  totalExpenses: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Enable automatic timestamps
});

// Define the association
userSchema.virtual('forgotPasswords', {
  ref: 'ForgotPassword',
  localField: '_id',
  foreignField: 'userId'
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Functions related to User model
const createUser = async (name, email, password) => {
  try {
    const newUser = new User({ name, email, password });
    const savedUser = await newUser.save();
    return { userId: savedUser._id };
  } catch (err) {
    throw err;
  }
};

// Get a user by email
const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user ? user : null;
  } catch (err) {
    throw err;
  }
};

// Get a user by ID
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user ? user : null;
  } catch (err) {
    throw err;
  }
};

// Update premium status of a user
const updatePremiumStatus = async (userId) => {
  try {
    const result = await User.findByIdAndUpdate(userId, { isPremiumUser: true }, { new: true });
    if (!result) {
      throw new Error('User not found');
    }
    console.log('Updated User:', result);
    return result;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

// Get the premium leaderboard
const getPremiumLeaderboard = async () => {
  try {
    const leaderboardData = await User.find().sort({ totalExpenses: -1 }).select('id name email totalExpenses');
    return leaderboardData;
  } catch (error) {
    throw error;
  }
};

// Function to update totalExpenses for a user
const updateTotalExpenses = async (userId) => {
  try {
    const userExpenses = await Expense.aggregate([
      { $match: { user_id: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpenses = userExpenses[0]?.total || 0;
    await User.findByIdAndUpdate(userId, { totalExpenses });
  } catch (error) {
    throw error;
  }
};

module.exports = { User, createUser, getUserByEmail, getUserById, updatePremiumStatus, getPremiumLeaderboard, updateTotalExpenses };
