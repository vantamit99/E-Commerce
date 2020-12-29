const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
    cus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customers"
    },
    listProduct: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products"
            },
            quantity: Number,
            color: String,
            size: String,
            isRating: {type: Boolean, default: false}
        }
    ],
    peopleRecive: String,
    addressRecive: String,
    phone: String,
    status: String,
    dateBook: Date,
    paymentMethods: String,
    totalMoneyPro: Number,
    shipping: Number,
    codeSaleMoney: Number, 
    totalAllMoney: Number,
    paid: Number,
    remain: Number
});

const orderModel = mongoose.model('OrderPayment', paymentSchema);
module.exports = orderModel;