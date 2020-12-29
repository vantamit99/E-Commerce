const mongoose = require('mongoose');
const rateSchema = new mongoose.Schema({
    star: Number,
    review: String,
    cus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customers"
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products"
    }
});
const rateModel = mongoose.model('Rates', rateSchema);

module.exports = rateModel;