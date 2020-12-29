const jwt = require("jsonwebtoken");
const cartModel = require('../../model/cart.model');
const proModel = require('../../model/product.model');
const userModel = require('../../model/user.model');
const cartDetailsModel = require('../../model/cartDetails.model');
const pointsModel = require('../../model/cumulativePoint.model');
const specialModel = require('../../model/special.model');


module.exports.cartGet = async function(req, res) {
    // xoa cartProduct cookie
    res.cookie('cartProduct', '', {maxAge: 1});
    const idCus = req.cookies.idCus;
    const idCartDetailsCookie = req.cookies.idCartDetailsAddProNoLogin;

    if(idCus) {
        var docCart = await cartDetailsModel.findOne({cus: idCus})
        .populate({
            path: 'cartProduct',
            populate: {
                path: 'product'
            }
        })
        .then(doc => doc);
        // === get rank user === //
        const cusPoint = await pointsModel.findOne({cus: idCus}).then(doc => doc);
        const listSpecial = await specialModel.find({}).then(doc => doc);
        
        if(cusPoint != null) {
            var pointCurrent = cusPoint.points;
            let pointNext = getRankNext().pointRank;

            var listRankSmallNext = listSpecial.filter((item, index) => {
                return item.pointRank < pointNext;
            })
            if(listRankSmallNext.length >= 1) {
                var rankCurrent = listRankSmallNext[listRankSmallNext.length - 1].nameRank;  
            } else {
                var rankCurrent = "anonymous";
            }
            //console.log(rankCurrent);

            function getRankNext() {
                let arrRankNext = listSpecial.filter(item => {
                    return item.pointRank > pointCurrent;
                });
                var arrRankNextFirst = arrRankNext[0];
                return arrRankNextFirst;            
            }

            if(rankCurrent != 'anonymous') {
                await cartDetailsModel.findOneAndUpdate({cus: idCus}, {$set: {shipping: 0}});
            }
            
        } else {
            var rankCurrent = "anonymous";
        }        

        if(docCart) {
            let listPro = docCart.cartProduct;
            //console.log(listPro);
            let totalNumberPro = listPro.map(val => {
                return val.quantity;
            }).reduce((total, current)=> {
                return total + current;
            });
            let moneyPro = listPro.map(val  => {
                return val.quantity * (val.product.price - val.product.price*val.product.discount/100);
            }).reduce((total, current)=> {
                return total + current;
            });
        
            let data = {
                title: 'Giỏ hàng',
                listPro: listPro,
                docCart: docCart,
                rankCurrent: rankCurrent,
                totalPro: totalNumberPro,
                moneyPro: moneyPro,
                extractScripts: true
            };
    
            return res.render('user/cart', data);
        } 
    } else {
        if(idCartDetailsCookie) {
            var docCart = await cartDetailsModel.findById(idCartDetailsCookie)
            .populate({
                path: 'cartProduct',
                populate: {
                    path: 'product'
                }
            })
            .then(doc => doc);

            if(docCart) {
                let listPro = docCart.cartProduct;
                //console.log(listPro);
                let totalNumberPro = listPro.map(val => {
                    return val.quantity;
                }).reduce((total, current)=> {
                    return total + current;
                });
                let moneyPro = listPro.map(val  => {
                    return val.quantity * (val.product.price - val.product.price*val.product.discount/100);
                }).reduce((total, current)=> {
                    return total + current;
                });
            
                let data = {
                    title: 'Giỏ hàng',
                    listPro: listPro,
                    docCart: docCart,
                    totalPro: totalNumberPro,
                    moneyPro: moneyPro,
                    extractScripts: true
                };
        
                return res.render('user/cart', data);
            }
        }
    }

    const data = {
        title: 'Giỏ hàng',
        docCart: null,
        extractScripts: true
    };
    return res.render('user/cart', data);
};
module.exports.cartPost = async function(req, res) {
    // xoa cartProduct cookie
    res.cookie('cartProduct', '', {maxAge: 1});
    
    var idPro = req.body.idPro;
    var size = req.body.size;
    var colorImage = req.body.color;
    var quantity = Number(req.body.quantity);
    var color = '';
    const token = req.cookies.authCookie;
    var docUser;

    await proModel.findById(idPro).then(doc => {
        return doc.color.map(val => {
            if(val.image == colorImage) {
                color = val.color;
                return val.color;
            }
        });
    });

    var cartNew = new cartModel();
    cartNew.product = idPro;
    cartNew.color = color;
    cartNew.size = size;
    cartNew.quantity = quantity;

    const addCart = await cartNew.save().then(doc => {return doc});
    const idCart = addCart._id;

    var cartDetailsNew = new cartDetailsModel();
    cartDetailsNew.createAdd = Date.now();
    cartDetailsNew.shipping = 30000;

    if(token) {
        // token ton tai => dang nhap
        await jwt.verify(token, 'secretkey', async (err, data) => {
            docUser = await userModel.findOne({email: data.email}).populate('cus').then(doc => {
                return doc;
            });
        });
        const idCus = docUser.cus._id;
        cartDetailsNew.cus = idCus;
        const checkCusAddCart = await cartDetailsModel.find({cus: idCus}).then(doc => {return doc});
        if(checkCusAddCart.length === 0) {
            // cus no exist in cart details
            await cartDetailsNew.save();
        }
        await cartDetailsModel.findOneAndUpdate({cus: idCus}, {$push: {cartProduct: idCart}});

    } else {
        // token k ton tai => k dang nhap
        const idCartDetailsCookie = req.cookies.idCartDetailsAddProNoLogin;
        cartDetailsNew.cus = null;
        
        if(idCartDetailsCookie) {
            await cartDetailsModel.findByIdAndUpdate(idCartDetailsCookie, {$push: {cartProduct: idCart}});
        } else {
            cartDetailsNew.cartProduct = idCart;
            const saveCartDetails = await cartDetailsNew.save().then(doc => doc);
            const idCartDetails = saveCartDetails._id;            
            console.log('id cart details' + idCartDetails);
            res.cookie('idCartDetailsAddProNoLogin', idCartDetails);
        }
    }

    return res.send('/cart');
};

module.exports.deleteGet = async function(req, res) {
    const idCus = req.cookies.idCus;
    const idCart = req.params.id;
    await cartModel.findByIdAndDelete(idCart);
    const cartListProduct = await cartDetailsModel.findOne({cus: idCus}).populate('cartProduct').then(doc => {return doc.cartProduct});
    await cartDetailsModel.findOneAndUpdate({cus: idCus}, {$set: {cartProduct: cartListProduct}});
    const cartListProductUpdate = await cartDetailsModel.findOne({cus: idCus}).then(doc => {return doc.cartProduct});
    //console.log(cartListProductUpdate.length);
    if(cartListProductUpdate.length === 0) {
        await cartDetailsModel.findOneAndDelete({cus: idCus});
    }
    return res.redirect('/cart');
};
module.exports.addquantity = async function(req, res) {
    const idCart = req.body.idCart;
    const quantity = Number(req.body.quantity);
    
    await cartModel.findByIdAndUpdate(idCart, {$set: {quantity: quantity}});

    return res.send('/cart');
};

