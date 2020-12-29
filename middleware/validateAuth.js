const { validationResult } = require("express-validator");
const userModel = require('../model/user.model');

const validateRegister = function(validations) {
  var arrError = [];
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) {
          return next();
        }
        arrError = [...errors.errors];
        const data = {
          title: 'Đăng Ký',
          error: arrError,
          countCart: 0,
          extractScripts: true
        };
        res.render("auth/register", data);
      };
};

const validateLogin = function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var errors = [];
    userModel.findOne({email: email, password: password}, function(err, doc){
        if(!doc) {
            errors.push('email không đúng', 'Mật khẩu không đúng');
            const data = {
              title: "Đăng Nhập",
              error: errors,
              docUser: null,
              countCart: 0,
              extractScripts: true
            };
            return res.render("auth/login", data);
        } 
        return next();
    });
};
module.exports = { validateLogin, validateRegister };
