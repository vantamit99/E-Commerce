const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/verifyToken');
const dashboard = require('../../controller/admin/dashboard.controller');

router.get('*', verifyToken);

router.get('/', dashboard.view);


module.exports = router;