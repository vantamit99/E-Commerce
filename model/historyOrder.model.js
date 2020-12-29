const mongoose = require('mongoose');
const historyOrderSchema = new mongoose.Schema({
    cus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customers',
    },
    listOrders: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orders'
    }
});
const historyOrderModel = new mongoose.model('historyOrders', historyOrderSchema);
module.exports = historyOrderModel;