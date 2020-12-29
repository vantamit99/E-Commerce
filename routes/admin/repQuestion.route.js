const express = require('express');
const router = express.Router();
const rep = require('../../controller/admin/repQuestion.controller');

router.post('/', rep.repPost);

module.exports = router;