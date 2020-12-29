const mongoose = require('mongoose');
const proSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
    discount: Number,
    description: String,
    dateCreate: Date,
    image: String,
    imageSub: [],
    size: [],
    color: [],
    cate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories"
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
    ]
});

const proModel = mongoose.model('Products', proSchema);
module.exports = proModel;