const express = require('express');
const router = express.Router();
const cate = require('../../controller/admin/cate.controller');
//const validateCate = require('../../middleware/validateCate');
const { verifyToken } = require('../../middleware/verifyToken');

router.get('*', verifyToken);

router.get('/', cate.view);

router.post('/create', cate.create);

router.get('/edit/:id', cate.editGet);
router.post('/edit/:id', cate.editPost);

router.get('/delete/:id', cate.deleteGet);
router.post('/delete/:id', cate.deletePost);

module.exports = router;