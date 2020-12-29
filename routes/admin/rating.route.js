const express = require('express');
const router = express.Router();
const rating = require('../../controller/admin/rating.controller');

router.get('/', rating.view);

module.exports = router;