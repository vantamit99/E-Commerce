const express = require('express');
const router = express.Router();
const cart = require('../../controller/user/cart.controller');
//const { checkRoleUser } = require('../../middleware/verifyToken');

//router.get('*', checkRoleUser);

router.get('/', cart.cartGet);
router.post('/', cart.cartPost);

router.get('/delete/:id', cart.deleteGet);

router.post('/addquantity', cart.addquantity);

module.exports = router;