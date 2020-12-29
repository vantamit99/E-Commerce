const express = require('express');
const router = express.Router();
const order = require('../../controller/user/order.controller');
//const { checkRoleUser } = require('../../middleware/verifyToken');

//router.get('*', checkRoleUser);

router.get('/history', order.history);

router.get('/history/details/:id', order.details);

router.get('/delete/:id', order.delete);

module.exports = router;