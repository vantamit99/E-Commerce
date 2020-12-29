const express = require('express');
const router = express.Router();
const product = require('../../controller/user/cate.controller');

router.get('/shoesboy', product.shoesboy);
router.get('/shoesgirl', product.shoesgirl);

module.exports = router;