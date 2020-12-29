const express = require('express');
const router = express.Router();
const search = require('../../controller/user/search.controller');

router.get("/", search.get);

module.exports = router;