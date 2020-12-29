const validatePhone = function(str) {
    return /^0[9835][1-9]\d{7,8}$/.test(str);
};
module.exports = { validatePhone };