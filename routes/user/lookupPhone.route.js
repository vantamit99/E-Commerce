const express = require('express');
const router = express.Router();
const lookupPhone = require('../../controller/user/lookupPhone.controller');

router.get('/cart', lookupPhone.cartGet);
router.get('/checkPhone', lookupPhone.checkPhone)

module.exports = router;