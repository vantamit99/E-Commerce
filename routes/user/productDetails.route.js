const express = require('express');
const router = express.Router();
const product = require('../../controller/user/productDetails.controller');

router.get('/:id', product.details);

module.exports = router;