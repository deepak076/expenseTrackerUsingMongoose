// C:\Users\DEEPSROCK\Desktop\node-js\Expense tracker\models\downloadFiles.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the DownloadedFile schema
const downloadedFileSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    file_url: {
        type: String,
        required: true,
    },
    download_date: {
        type: Date,
        default: Date.now,
    },
});

// Create the DownloadedFile model
const DownloadedFile = mongoose.model('DownloadedFile', downloadedFileSchema);

// Function to save a downloaded file
const saveDownloadedFile = async (userId, fileUrl) => {
    try {
        const downloadedFile = new DownloadedFile({
            user_id: userId,
            file_url: fileUrl,
        });
        await downloadedFile.save();
        return downloadedFile;
    } catch (error) {
        console.error('Error saving downloaded file:', error);
        throw error;
    }
};

module.exports = { DownloadedFile, saveDownloadedFile };


// const { DataTypes } = require('sequelize');
// const sequelize = require('../util/database');

// const DownloadedFile = sequelize.define('downloaded_files', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     user_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
//     file_url: {
//         type: DataTypes.STRING(255),
//         allowNull: false,
//     },
//     download_date: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW,
//     },
// });

// const saveDownloadedFile = async (userId, fileUrl) => {
//     try {
//         const downloadedFile = await DownloadedFile.create({
//             user_id: userId,
//             file_url: fileUrl,
//         });
//         return downloadedFile;
//     } catch (error) {
//         console.error('Error saving downloaded file:', error);
//         throw error;
//     }
// };

// module.exports = { DownloadedFile, saveDownloadedFile };
