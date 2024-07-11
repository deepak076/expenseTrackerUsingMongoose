const Order = require('../models/order');

const createOrder = async (orderId, status, userId) => {
    try {
        const newOrder = new Order({ orderId, status, userId });
        const savedOrder = await newOrder.save();
        return { orderId: savedOrder.orderId };
    } catch (error) {
        throw new Error(`Error creating order: ${error.message}`);
    }
};

const getOrderById = async (orderId) => {
    try {
        const order = await Order.findOne({ orderId });
        return order;
    } catch (error) {
        throw new Error(`Error getting order by id: ${error.message}`);
    }
};

const updateOrder = async (orderId, { paymentId, status }) => {
    try {
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId },
            { paymentId, status },
            { new: true }
        );
        return updatedOrder;
    } catch (error) {
        throw new Error(`Error updating order: ${error.message}`);
    }
};

module.exports = {
    createOrder,
    getOrderById,
    updateOrder
};
