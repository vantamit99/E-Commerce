const express = require('express');
const router = express.Router();
const revenue = require('../../controller/admin/revenue.controller');

router.get('/', revenue.index);

module.exports = router;