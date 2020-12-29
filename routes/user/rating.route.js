const express = require('express');
const router = express.Router();
const rating = require('../../controller/user/rating.controller');

router.get('/product/:id', rating.view);

router.get('/history', rating.history);

router.post('/save', rating.save);

module.exports = router;