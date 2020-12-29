const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    phone: {type: String, unique: true},
    email: {type: String, unique: true},
    password: String,
    cus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customers"
    }
});
const userModel = mongoose.model('Users', userSchema);

module.exports = userModel;