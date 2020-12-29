const express = require('express');
const router = express.Router();
const product = require('../../controller/admin/product.controller');
const { upload } = require('../../middleware/uploadImage');
const { verifyToken } = require('../../middleware/verifyToken');

router.get('*', verifyToken);

router.get('/', product.view);
router.get('/details/:id', product.details);

router.post('/create', upload.any(), product.createPost);

router.get('/edit/:id', product.editGet);
router.post('/edit/:id', upload.any(), product.editPost);

router.get('/delete/:id', product.deleteGet);
router.post('/delete/:id', product.deletePost);

router.get('/test', (req, res)=> { 
    return res.render('admin/test', {title: 'test', layout: './layout/layoutAdmin.ejs'});
});

module.exports = router;