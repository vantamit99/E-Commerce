const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products"
    },
    color: String,
    size: String,
    quantity: Number
});

const cartModel = mongoose.model('Carts', cartSchema);
module.exports = cartModel;