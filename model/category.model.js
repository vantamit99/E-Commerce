const mongoose = require('mongoose');
const cateSchema = new mongoose.Schema({
    name: String,
    product: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products"
        }
    ],
});

const cateModel = mongoose.model('Categories', cateSchema);
module.exports = cateModel;