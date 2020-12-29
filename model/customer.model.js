const mongoose = require('mongoose');
const cusSchema = new mongoose.Schema({
    isMember: Boolean,
    image: String,
    deliveryAddress: String,
    phone: String,
    expense: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    special: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Specials"
    },
    rate: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rates"
        }
    ],
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comments"
        }
    ],
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Carts"
    }
});

const cusModel = mongoose.model('Customers', cusSchema);
module.exports = cusModel;