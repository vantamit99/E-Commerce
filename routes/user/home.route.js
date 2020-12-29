const express = require('express');
const router = express.Router();
const home = require('../../controller/user/home.controller');
const { upload } =  require('../../middleware/uploadImage');

router.get('/', home.index);

router.get('/profile', home.profileGet);
router.post('/profile', upload.any(), home.profilePost);

router.get('/promotion', home.promotion);

module.exports = router;