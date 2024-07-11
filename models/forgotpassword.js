// models\forgotpassword.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the ForgotPassword schema
const forgotPasswordSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresBy: {
    type: Date
  }
}, {
  timestamps: true // Enable automatic timestamps (createdAt, updatedAt)
});

// Create the ForgotPassword model
const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);

module.exports = ForgotPassword;
