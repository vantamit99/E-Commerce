const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");
const cartDetailsModel = require('../model/cartDetails.model');

const verifyToken = function(req, res, next) {
    const token = req.cookies.authCookie;

    if(token == undefined) {
        return res.sendStatus(403);
    }
    jwt.verify(token, 'secretkey', (err, data) => {
        if(err) {
            return res.sendStatus(403);
        }
        //req.email = data.email;
        if(data.email != 'admin@gmail.com') {
            return res.sendStatus(403);
        }
        next();
    });
}; 
const checkRoleUser = function(req, res, next) {
    const token = req.cookies.authCookie;

    if(token == undefined) {
        res.redirect('/');
    }
    jwt.verify(token, 'secretkey', (err, data) => {
        if(err) {
            return res.redirect('/');
        }
        next();
    });
};

const checkUser = async function(req, res, next) {
    const token = req.cookies.authCookie;
    //console.log(`token = ${token}`);
    if(token == undefined) {
        res.cookie('idCus', '', {maxAge: 1});
        res.cookie('idCartDetails', '', {maxAge: 1});
        res.cookie('idOrderPayment', '', {maxAge: 1});
        res.cookie('allTotalMoney', '', {maxAge: 1});
        res.locals.docUser = null;
        const idCartDetailsAddProNoLogin = req.cookies.idCartDetailsAddProNoLogin;
        
        if(idCartDetailsAddProNoLogin) {
            const cartDetails = await cartDetailsModel.findById(idCartDetailsAddProNoLogin).populate('cartProduct').then(doc => doc);
           
            const countQuantityNoLogin = cartDetails.cartProduct.map(val => {
                return val.quantity;
            }).reduce((total, current) => {
                return total + current;
            });
            res.locals.countCart = countQuantityNoLogin;
        } else {
            res.locals.countCart = 0;
        }
        return next();
    }
    jwt.verify(token, 'secretkey', async (err, data) => {
        const docUser = await userModel.findOne({email: data.email}).populate('cus').then(doc => {
            return doc;
        });
        res.locals.docUser = docUser;
        res.locals.countCart = 0;
        
        const idCus = docUser.cus._id;
        const checkCusAddCart = await cartDetailsModel.find({cus: idCus}).then(doc => doc);
        
        if(checkCusAddCart.length > 0) {
            // cus exist in cart details
            const cartProduct = await cartDetailsModel.findOne({cus: idCus}).populate('cartProduct').then(doc => doc.cartProduct);           
            const countQuantity = cartProduct.map(val => {
                return val.quantity;
            }).reduce((total, current) => {
                return total + current;
            });
            res.locals.countCart = countQuantity;
            return next();
        }

        return next();
    });
}; 


module.exports = {verifyToken , checkUser, checkRoleUser};