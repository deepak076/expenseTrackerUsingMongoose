const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, 'secretkey');
    const user = await User.findById(decoded.userId).select('id name email isPremiumUser');

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false, error: err.message });
  }
};

module.exports = { authenticate };
