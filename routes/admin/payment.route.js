const express = require('express');
const router = express.Router();
const payment = require('../../controller/admin/payment.controller');

router.get('/delivery', payment.delivery);

router.get('/paypal', payment.paypal);

router.get('/cancel', payment.cancel);

router.get('/details/:id', payment.details);

module.exports = router;