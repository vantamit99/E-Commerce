const express = require('express');
const router = express.Router();
const filterPrice = require('../../controller/user/filterPrice.controller');

router.get('/all', filterPrice.all);
router.get('/small', filterPrice.small);
router.get('/medium', filterPrice.medium);
router.get('/high', filterPrice.high);

module.exports = router;