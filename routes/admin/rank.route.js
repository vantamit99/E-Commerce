const express = require('express');
const router = express.Router();
const rank = require('../../controller/admin/rank.controller');

router.get('/', rank.index);

router.post('/add', rank.add);

router.get('/edit/:id', rank.editGet);
router.post('/edit/:id', rank.editPost);

router.get('/delete/:id', rank.deleteGet);
router.post('/delete/:id', rank.deletePost);

module.exports = router;