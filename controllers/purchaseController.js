// C:\Users\DEEPSROCK\Desktop\node-js\Expense tracker\controllers\purchaseController.js
const Razorpay = require('razorpay');
const orderModel = require('../models/orderModel');
const User = require('../models/userModel');

const purchasepremium = async (req, res) => {
    try {
        console.log("purchasepremium is running");
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        console.log("key_id:", process.env.RAZORPAY_KEY_ID);
        console.log("key_secret:", process.env.RAZORPAY_KEY_SECRET);
        const amount = 2500;

        // Create a new order using Razorpay
        const order = await new Promise((resolve, reject) => {
            rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
                console.log("order creating");
                if (err) {
                    console.log("error in order creating ");
                    reject(err);
                } else {
                    resolve(order);
                }
            });
        });

        // Save the order details in MongoDB
        try {
            console.log("Order ID:", order.id);
            console.log("User ID:", req.user._id);
            await orderModel.createOrder(order.id, 'PENDING', req.user._id); // Assuming createOrder function is implemented in orderModel.js
            return res.status(201).json({ order, key_id: rzp.key_id });
        } catch (err) {
            throw new Error(err);
        }
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err.message });
    }
};


const updateTransactionStatus = async (req, res) => {
    try {
        // Extract payment_id, order_id, and paymentSuccessful from req.body
        const { payment_id, order_id } = req.body;
        let { paymentSuccessful } = req.body;

        // Convert req.user.id to string
        const userId = req.user.id.toString(); // Convert ObjectId to string

        // Update order status to SUCCESS or FAILED
        if (payment_id) {
            await orderModel.updateOrder(order_id, {
                paymentid: payment_id,
                status: 'SUCCESS',
            });

            // Update user premium status if payment is successful
            if (paymentSuccessful) {
                try {
                    const updatedUser = await User.updatePremiumStatus(userId);
                    console.log("Updated user premium status:", updatedUser);
                } catch (error) {
                    console.error("Error updating user premium status:", error);
                    throw error; // Throw the error up to handle in the catch block
                }
            }

            console.log("Order updated successfully");
            res.status(202).json({ success: true, message: "Transaction Successful" });
        } else {
            await orderModel.updateOrder(order_id, {
                paymentid: payment_id,
                status: 'FAILED',
            });

            console.log("Order updation failed");
            res.status(202).json({ success: false, message: "Transaction Failed" });
        }
    } catch (err) {
        console.error("Error in updateTransactionStatus:", err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

const getPremiumLeaderboard = async (req, res) => {
    try {
        const leaderboardData = await User.getPremiumLeaderboard();
        res.json({ success: true, leaderboardData });
    } catch (error) {
        console.error('Error fetching premium leaderboard:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

module.exports = {
    purchasepremium,
    updateTransactionStatus,
    getPremiumLeaderboard
};