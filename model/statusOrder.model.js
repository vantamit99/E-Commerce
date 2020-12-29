const mongoose = require('mongoose');
const statusOrderSchema = new mongoose.Schema({
    idStatus: String,
    nameStatus: String
});

const statusOrderModel = mongoose.model('statusOrder', statusOrderSchema);
module.exports = statusOrderModel;