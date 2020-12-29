const express = require('express');
const router = express.Router();
const cus = require('../../controller/admin/customer.controller');

router.get('/', cus.index);

module.exports = router;