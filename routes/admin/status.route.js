const express = require('express');
const router = express.Router();
const status = require('../../controller/admin/status.controller');
const { verifyToken } = require('../../middleware/verifyToken');

router.get('/', status.view);

router.post('/create', status.createPost);

router.get('/edit/:id', status.editGet);
router.post('/edit/:id', status.editPost);

router.get('/delete/:id', status.deleteGet);
router.post('/delete/:id', status.deletePost);

router.post('/update', status.update);


module.exports = router;