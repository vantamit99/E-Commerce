const mongoose = require('mongoose');
const specialSchema = new mongoose.Schema({
    nameRank: String,
    pointRank: Number
});

const specialModel = mongoose.model('Specials', specialSchema);

module.exports = specialModel;