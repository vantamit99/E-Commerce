const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    comment: String,
    cus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customers"
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products"
    },
    rep: {type: String, default: "Shop sẽ phản hồi trong 24h!"}
});
const commentModel = mongoose.model('Comments', commentSchema);

module.exports = commentModel;