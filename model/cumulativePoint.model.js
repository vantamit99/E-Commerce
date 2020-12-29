const mongoose = require('mongoose');
const pointsSchema = new mongoose.Schema({
    cus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customers'
    },
    points: Number
});
const pointsModel = mongoose.model('Points', pointsSchema);
module.exports = pointsModel;