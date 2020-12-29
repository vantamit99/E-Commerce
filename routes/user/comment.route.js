const express = require('express');
const router = express.Router();
const comment = require('../../controller/user/comment.controller');

router.post('/', comment.commentPost);

module.exports = router;