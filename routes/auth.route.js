const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const { validateLogin, validateRegister } = require('../middleware/validateAuth');
const { checkUser } = require('../middleware/verifyToken');
const { check } = require('express-validator');

router.get("/", authController.authRedirect);

router.get("/register", authController.registerGet);
router.post("/register", checkUser, validateRegister([
    check('firstname', 'Họ không được rỗng').notEmpty(),
    check('lastname', 'Tên không được rỗng').notEmpty(),
    check('phone').isLength({min: 10, max: 11}).withMessage('Điện thoại phải 10 số hoặc 11 số')
    .isNumeric().withMessage('Điện thoại không được chứa ký tự'), 
    check('email', 'Email không hợp lệ').isEmail(),
    check('password').notEmpty().withMessage('Mật khẩu không rỗng')
    .isLength({min: 4}).withMessage('Mật khẩu phải ít nhất 4 ký tự')
]), authController.registerPost);

router.get("/login", authController.loginGet);
router.post("/login", validateLogin, authController.loginPost);

router.get("/logout", authController.logout);

router.get("/changePassword", authController.changePassGet);
router.post("/changePassword", authController.changePassPost);

module.exports = router;