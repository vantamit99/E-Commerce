const validateCate = function(req, res, next) {
    if(req.body.cateProduct === "") {
       return res.send('<script>alert("khong duoc de trong")</script>');
    }
    return next();
};
module.exports = validateCate;