// // C:\Users\DEEPSROCK\Desktop\node-js\Expense tracker\models\order.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderId: {
    type: String, // Assuming orderId is a string identifier
    required: true,
    unique: true
  },
  status: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId, // Reference to User model if needed
    ref: 'User'
  },
  paymentId: {
    type: String // Assuming paymentId is a string identifier
  }
}, {
  timestamps: true // Add timestamps for createdAt and updatedAt
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

// const db = require('../db').promise(); // Use the promise interface

// const createOrder = async (orderid, status, user_id) => {
//     const insertOrderQuery = 'INSERT INTO `order` (orderid, status, user_id) VALUES (?, ?, ?)';
//     try {
//         const [result] = await db.query(insertOrderQuery, [orderid, status, user_id]);
//         return { orderId: result.insertId };
//     } catch (err) {
//         throw err;
//     }
// };

// const getOrderById = async (orderId) => {
//     try {
//         console.log("order id line 17", orderId);
//         const query = 'SELECT * FROM `order` WHERE orderid = ?';
//         const [rows] = await db.query(query, [orderId]); // Use the promise interface
//         console.log("rows line 20:", rows);
//         console.log(rows.length > 0);
//         if (Array.isArray(rows) && rows.length > 0) {
//             const orderData = rows[0];
//             console.log("order data , order", orderData);
//             return orderData;
//         } else {
//             console.log("else is running");
//             return null;
//         }
//     } catch (error) {
//         console.error('Error getting order:', error.message);
//         throw new Error(`Error getting order: ${error.message}`);
//     }
// };

// const updateOrder = async (orderId, { paymentid, status }) => {
//     try {
//         const query = 'UPDATE `order` SET paymentid = ?, status = ? WHERE orderid = ?';
//         await db.query(query, [paymentid, status, orderId]);
//     } catch (error) {
//         throw new Error(`Error updating order: ${error.message}`);
//     }
// };

// module.exports = { createOrder, getOrderById, updateOrder };
