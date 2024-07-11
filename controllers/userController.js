const bcrypt = require('bcrypt');
const { User } = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Function to generate an access token
function generateAccessToken(id, name) {
  return jwt.sign({ userId: id, name: name }, 'secretkey');
}

// Signup function
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ success: false, error: 'Email already in use.' });
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create a new user in the database with the hashed password
      const newUser = new User({ name, email, password: hashedPassword });
      const savedUser = await newUser.save();
      
      res.status(201).json({ success: true, message: 'User registered successfully', userId: savedUser._id });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Login function
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        const token = generateAccessToken(user._id, user.name);
        res.status(200).json({ success: true, message: 'Login successful.', token });
      } else {
        res.status(401).json({ success: false, error: 'Login failed.' });
      }
    } else {
      res.status(404).json({ success: false, error: 'User not found.' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { signup, login };
