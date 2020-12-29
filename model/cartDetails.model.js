const mongoose = require('mongoose');
const cartDetailsSchema = new mongoose.Schema({
    cus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customers"
    },
    cartProduct: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Carts"
        }
    ],
    createAdd: Date,
    shipping: Number
});

const cartDetailsModel = mongoose.model('CartDetails', cartDetailsSchema);
module.exports = cartDetailsModel;