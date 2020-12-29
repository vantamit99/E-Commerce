const express = require('express');
const router = express.Router();
const payment = require('../../controller/user/payment.controller');
//const { checkRoleUser } = require('../../middleware/verifyToken');

router.get('/', payment.paymentGet);
router.post('/', payment.paymentPost);

router.get('/now', payment.paymentNowGet);
router.post('/now', payment.paymentNowPost);

router.post('/checkout', payment.checkoutPost);

router.get('/checkout/success', payment.checkoutSuccess);
router.get('/checkout/fail', payment.checkoutFail);


module.exports = router;