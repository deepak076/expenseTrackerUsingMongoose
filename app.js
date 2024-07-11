const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
// const mysql = require('mysql2');
// const sequelize = require('./util/database');
const app = express();
const port = 3000;
const helmet = require('helmet');
const morgan = require('morgan');

console.log(process.env.NODE_ENV);

app.use(express.static('public'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { DownloadedFile } = require('./models/downloadFiles');

// Include the user and expense routes
app.use('/user', require('./routes/userRoutes'));
app.use('/expense', require('./routes/expenseRoutes'));
app.use('/purchase', require('./routes/purchaseRoutes'));
app.use('/premium', require('./routes/premiumRoutes'));
app.use('/password', require('./routes/forgotpasswordRoutes'));

// console.log("app.js");
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
