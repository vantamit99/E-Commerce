const paypal = require('paypal-rest-sdk');
const cartDetailsModel = require("../../model/cartDetails.model");
const proModel = require('../../model/product.model');
const orderModel = require('../../model/orderPayment.model');
const cartModel = require('../../model/cart.model');
const pointsModel = require('../../model/cumulativePoint.model');
const specialModel = require('../../model/special.model');

paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AenZMowTT0KNINbBOiZWLkrO2qr1rGJMjCsAK8rWUViL5xrvj-3actdnFD3W-z4rWJdT-YHa_2LvXf7Y',
    'client_secret': 'EDKX0jYXhVc95pe-gfyMM_Pjwv6j2-jphmODyZ060wUlxccnLSvHVmCM3DJVEXJksN077bWsKR4hXOAi'
});

module.exports.paymentGet = async function (req, res) {
    const idCartDetails = req.cookies.idCartDetails;
    const idCartDetailsCookieNoLogin = req.cookies.idCartDetailsAddProNoLogin;
    
    const cartDetails = await cartDetailsModel.findById(idCartDetails)
        .populate({
            path: 'cartProduct',
            populate: {
                path: 'product'
            }
        })
        .then(doc => {
            return doc
        });
    
    const idCus = cartDetails.cus;
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

    const listPro = cartDetails.cartProduct;
    const totalNumberPro = listPro.map(val => {
        return val.quantity;
    }).reduce((total, current) => {
        return total + current;
    });
    const moneyPro = listPro.map(val => {
        return val.quantity * (val.product.price - val.product.price * val.product.discount / 100);
    }).reduce((total, current) => {
        return total + current;
    });

    if(cartDetails.cus == null && !idCartDetailsCookieNoLogin) {
        const data = {
            title: 'Thanh Toán',
            listPro: listPro,
            docCart: cartDetails,
            totalPro: totalNumberPro,
            idCartDetails: null,
            moneyPro: moneyPro,
            extractScripts: true
        };
        return res.render('user/payment', data);
    } 
    
    const data = {
        title: 'Thanh Toán',
        listPro: listPro,
        docCart: cartDetails,
        rankCurrent: rankCurrent,
        totalPro: totalNumberPro,
        idCartDetailsNoLogin: idCartDetailsCookieNoLogin,
        moneyPro: moneyPro,
        extractScripts: true
    };
    return res.render('user/payment', data);
};
module.exports.paymentPost = async function (req, res) {
    const idCartDetails = req.body.idCartDetails;
    const code = req.body.code;

    return res.send('/payment');
};

module.exports.paymentNowGet = async function (req, res) {
    const idPro = req.query.idPro;
    const colorImage = req.query.color;
    const size = req.query.size;
    const quantity = req.query.quantityPro;
    const idCus = req.cookies.idCus;
    var color = '';

    const docPro = await proModel.findById(idPro).then(doc => {
        return doc
    });
    const arrColor = docPro.color.map(val => {
        if (val.image == colorImage) {
            color = val.color;
            return;
        }
        return;
    });
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

    const cartProduct = {
        product: idPro,
        quantity: quantity,
        color: color,
        size: size,
    };
    res.cookie('cartProduct', JSON.stringify(cartProduct));
    

    const data = {
        title: 'Thanh Toán',
        docPro: docPro,
        color: color,
        rankCurrent: rankCurrent,
        size: size,
        quantity: quantity,
        extractScripts: true
    };

    return res.render('user/paymentNow', data);
};
module.exports.paymentNowPost = function (req, res) {
    console.log(req.body);
    return res.send('/payment/now');
};

module.exports.checkoutPost = async function (req, res) {
    const peopleRecive = req.body.peopleRecive;
    const addressRecive = req.body.addressRecive;
    const phone = req.body.phone;
    const paymentMethods = req.body.methodPayment;
    const codeSale = req.body.codeSale;
    const totalMoneyPro = req.body.moneyPro;
    const shipping = req.body.shipping;
    const totalAllMoney = req.body.totalAllMoney;
    const idCartDetails = req.cookies.idCartDetails;
    const idCus = req.cookies.idCus;
    const paid = 0;
    const cartProductCookie = req.cookies.cartProduct;
    const idCartDetailsCookieNoLogin = req.cookies.idCartDetailsAddProNoLogin;   

    if (!idCus) {
        if(idCartDetailsCookieNoLogin) {
            // khong dang nhap nhung them gio hang        
            var docCartDetails = await cartDetailsModel.findById(idCartDetailsCookieNoLogin)
            .populate({
                path: 'cartProduct',
                populate: {
                    path: 'product'
                }
            })
            .then(doc => {
                return doc
            });            

            const listPro = docCartDetails.cartProduct;          
            
            const arrIdCart = listPro.map(val => val._id);
            const updateQuatity = function() {
                listPro.map( async (val) => {
                    const quantityCurrent = val.product.quantity - val.quantity;
                    //console.log(quantityCurrent);
                    await proModel.findByIdAndUpdate(val.product._id, {$set: {quantity: quantityCurrent}})
                });
            }();

            var orderPayment = new orderModel();
            (function () {
                orderPayment.cus = null;
                orderPayment.listProduct = listPro;
                orderPayment.peopleRecive = peopleRecive;
                orderPayment.addressRecive = addressRecive;
                orderPayment.phone = phone;
                orderPayment.status = '1';
                orderPayment.dateBook = Date.now();
                orderPayment.paymentMethods = paymentMethods;
                orderPayment.totalMoneyPro = totalMoneyPro;
                orderPayment.shipping = shipping;
                orderPayment.codeSaleMoney = codeSale;
                orderPayment.totalAllMoney = totalAllMoney;
                orderPayment.paid = paid;
                orderPayment.remain = totalAllMoney - paid;
            }());
            var docOrderPayment = await orderPayment.save().then(doc => doc);
            //console.log(docOrderPayment);           

            var idOrderPayment = docOrderPayment._id;
            res.cookie('idOrderPayment', idOrderPayment);
            arrIdCart.map(async (id) => {
                return await cartModel.findByIdAndDelete(id);
            });
            await cartDetailsModel.findByIdAndDelete(idCartDetailsCookieNoLogin);
            await res.cookie('idCartDetails', '', {
                maxAge: 1
            });
            await res.cookie('idCartDetailsAddProNoLogin', '', {
                maxAge: 1
            });

            if (paymentMethods == "paypal") {
                console.log("thanh toan bang paypal khi chua dang nhap them vao gio hang");
                var convertCurrency = 0;
                
                const items = listPro.map(val => {
                    let objItems = {};
                    let priceNew = val.product.price * (100 - val.product.discount) / 100;

                    objItems.name = val.product.name;
                    objItems.sku = val.product._id;
                    objItems.price = Math.round(priceNew / 23176.20);
                    objItems.currency = "USD";
                    objItems.quantity = val.quantity;

                    convertCurrency += objItems.price * objItems.quantity;

                    return objItems;
                })

                console.log(`totalMoney = ${convertCurrency}`);
                res.cookie('allTotalMoney', convertCurrency);

                const create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": "http://localhost:1999/payment/checkout/success",
                        "cancel_url": "http://localhost:1999/payment/checkout/fail"
                    },
                    "transactions": [{
                        "item_list": {
                            "items": items
                        },
                        "amount": {
                            "currency": "USD",
                            "total": convertCurrency
                        },
                        "description": "Thanh toán paypal"
                    }]
                };

                paypal.payment.create(create_payment_json, function (error, payment) {
                    if (error) {
                        throw error;
                    } else {
                        for (let i = 0; i < payment.links.length; i++) {
                            if (payment.links[i].rel === "approval_url") {
                                res.redirect(payment.links[i].href);
                            }
                        }
                    }
                });
            } else {           
                return res.redirect('/payment/checkout/success');
            }

        } else {
            // khong dang nhap nhung mua ngay
            let orderPayment = new orderModel();
            let cartProduct = JSON.parse(cartProductCookie);
            let listPro = [];
            listPro.push(cartProduct);
            //console.log(listPro);

            orderPayment.listProduct = listPro;
            orderPayment.peopleRecive = peopleRecive;
            orderPayment.addressRecive = addressRecive;
            orderPayment.phone = phone;
            orderPayment.status = '1';
            orderPayment.dateBook = Date.now();
            orderPayment.paymentMethods = paymentMethods;
            orderPayment.totalMoneyPro = totalMoneyPro;
            orderPayment.shipping = shipping;
            orderPayment.codeSaleMoney = codeSale;
            orderPayment.totalAllMoney = totalAllMoney;
            orderPayment.paid = paid;
            orderPayment.remain = totalAllMoney - paid;

            let docOrderPayment = await orderPayment.save().then(doc => doc);
            let idOrderPayment = docOrderPayment._id;
            res.cookie('idOrderPayment', idOrderPayment);
            res.cookie('cartProduct', '', {
                maxAge: 1
            });

            const idProduct = cartProduct.product;
            const docProduct = await proModel.findById(idProduct).then(doc => doc);
            const quantityCurrent = docProduct.quantity - cartProduct.quantity;
            //console.log(quantityCurrent);
            await proModel.findByIdAndUpdate(idProduct, {quantity: quantityCurrent});
            if (paymentMethods == "paypal") {
                console.log("thanh toan paypal khi chua dang nhap");
                var convertCurrency = 0;
                let items = [];
                let objItems = {};
                let priceNew = docProduct.price * (100 - docProduct.discount) / 100;
    
                objItems.name = docProduct.name;
                objItems.sku = docProduct._id;
                objItems.price = Math.round(priceNew / 23176.20);
                objItems.currency = "USD";
                objItems.quantity = cartProduct.quantity;
    
                items.push(objItems);
                convertCurrency = objItems.price * objItems.quantity
    
                console.log(`totalMoney = ${convertCurrency}`);
                res.cookie('allTotalMoney', convertCurrency);
    
                const create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": "http://localhost:1999/payment/checkout/success",
                        "cancel_url": "http://localhost:1999/payment/checkout/fail"
                    },
                    "transactions": [{
                        "item_list": {
                            "items": items
                        },
                        "amount": {
                            "currency": "USD",
                            "total": convertCurrency
                        },
                        "description": "Thanh toán paypal"
                    }]
                };
    
                paypal.payment.create(create_payment_json, function (error, payment) {
                    if (error) {
                        throw error;
                    } else {
                        for (let i = 0; i < payment.links.length; i++) {
                            if (payment.links[i].rel === "approval_url") {
                                res.redirect(payment.links[i].href);
                            }
                        }
                    }
                });
            } else {
                return res.redirect('/payment/checkout/success');
            }
        }
    } else {
        const listPoints = await pointsModel.findOne({cus: idCus}).then(doc => doc);
        //console.log(listPoints);

        if (cartProductCookie) {
            // da dang nhap nhung mua ngay
            let orderPayment = new orderModel();

            let cartProduct = JSON.parse(cartProductCookie);
            let listPro = [];
            listPro.push(cartProduct);
            //console.log(listPro);

            orderPayment.cus = idCus;
            orderPayment.listProduct = listPro;
            orderPayment.peopleRecive = peopleRecive;
            orderPayment.addressRecive = addressRecive;
            orderPayment.phone = phone;
            orderPayment.status = '1';
            orderPayment.dateBook = Date.now();
            orderPayment.paymentMethods = paymentMethods;
            orderPayment.totalMoneyPro = totalMoneyPro;
            orderPayment.shipping = shipping;
            orderPayment.codeSaleMoney = codeSale;
            orderPayment.totalAllMoney = totalAllMoney;
            orderPayment.paid = paid;
            orderPayment.remain = totalAllMoney - paid;

            const idProduct = cartProduct.product;
            const docProduct = await proModel.findById(idProduct).then(doc => doc); 
            const quantityCurrent = docProduct.quantity - cartProduct.quantity;
            //console.log(quantityCurrent);
            await proModel.findByIdAndUpdate(idProduct, {quantity: quantityCurrent});


            let docOrderPayment = await orderPayment.save().then(doc => doc);
            //console.log(docOrderPayment);

            if(listPoints) {
                // khach hang co diem tich luy
                const updatePoints = Number(listPoints.points) + Number(totalMoneyPro);
                await pointsModel.findOneAndUpdate({cus: idCus}, {$set: {points: updatePoints}});
            } else {
                // khach hang khong co diem tich luy
                var pointsNew = pointsModel();
                pointsNew.cus = idCus;
                pointsNew.points = totalMoneyPro;
                
                await pointsNew.save();
            }
    
            let idOrderPayment = docOrderPayment._id;
            res.cookie('idOrderPayment', idOrderPayment); 
            res.cookie('cartProduct', '', {
                maxAge: 1
            });

            if (paymentMethods == "paypal") {
                console.log("thanh toan bang paypal khi dang nhap mua ngay");
                var convertCurrency = 0;
                let items = [];
                let objItems = {};
                let priceNew = docProduct.price * (100 - docProduct.discount) / 100;

                objItems.name = docProduct.name;
                objItems.sku = docProduct._id;
                objItems.price = Math.round(priceNew / 23176.20);
                objItems.currency = "USD";
                objItems.quantity = cartProduct.quantity;

                items.push(objItems);
                convertCurrency = objItems.price * objItems.quantity

                console.log(`totalMoney = ${convertCurrency}`);
                res.cookie('allTotalMoney', convertCurrency);

                const create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": "http://localhost:1999/payment/checkout/success",
                        "cancel_url": "http://localhost:1999/payment/checkout/fail"
                    },
                    "transactions": [{
                        "item_list": {
                            "items": items
                        },
                        "amount": {
                            "currency": "USD",
                            "total": convertCurrency
                        },
                        "description": "Thanh toán paypal"
                    }]
                };

                paypal.payment.create(create_payment_json, function (error, payment) {
                    if (error) {
                        throw error;
                    } else {
                        for (let i = 0; i < payment.links.length; i++) {
                            if (payment.links[i].rel === "approval_url") {
                                res.redirect(payment.links[i].href);
                            }
                        }
                    }
                });
            } else {               
                return res.redirect('/payment/checkout/success');
            }
        }
        // da dang nhap nhung da them vao gio hang 

        var docCartDetails = await cartDetailsModel.findById(idCartDetails)
            .populate({
                path: 'cartProduct',
                populate: {
                    path: 'product'
                }
            })
            .then(doc => {
                return doc
            });

        const listPro = docCartDetails.cartProduct;
        const arrIdCart = listPro.map(val => val._id);
        const updateQuatity = function() {
            listPro.map( async (val) => {
                const quantityCurrent = val.product.quantity - val.quantity;
                //console.log(quantityCurrent);
                await proModel.findByIdAndUpdate(val.product._id, {$set: {quantity: quantityCurrent}})
            });
        }();

        var orderPayment = new orderModel();
        (function () {
            orderPayment.cus = idCus;
            orderPayment.listProduct = listPro;
            orderPayment.peopleRecive = peopleRecive;
            orderPayment.addressRecive = addressRecive;
            orderPayment.phone = phone;
            orderPayment.status = '1';
            orderPayment.dateBook = Date.now();
            orderPayment.paymentMethods = paymentMethods;
            orderPayment.totalMoneyPro = totalMoneyPro;
            orderPayment.shipping = shipping;
            orderPayment.codeSaleMoney = codeSale;
            orderPayment.totalAllMoney = totalAllMoney;
            orderPayment.paid = paid;
            orderPayment.remain = totalAllMoney - paid;
        }());
        var docOrderPayment = await orderPayment.save().then(doc => doc);
        //console.log(docOrderPayment);
        
        if(listPoints) {
            // khach hang co diem tich luy
            const updatePoints = Number(listPoints.points) + Number(totalMoneyPro);
            await pointsModel.findOneAndUpdate({cus: idCus}, {$set: {points: updatePoints}});
        } else {
            // khach hang khong co diem tich luy
            var pointsNew = pointsModel();
            pointsNew.cus = idCus;
            pointsNew.points = totalMoneyPro;
            
            await pointsNew.save();
        }

        var idOrderPayment = docOrderPayment._id;
        res.cookie('idOrderPayment', idOrderPayment);
        arrIdCart.map(async (id) => {
            return await cartModel.findByIdAndDelete(id);
        });
        await cartDetailsModel.findByIdAndDelete(idCartDetails);
        await res.cookie('idCartDetails', '', {
            maxAge: 1
        });

        if (paymentMethods == "paypal") {
            console.log("thanh toan bang paypal khi dang nhap them vao gio hang");
            var convertCurrency = 0;
            
            const items = listPro.map(val => {
                let objItems = {};
                let priceNew = val.product.price * (100 - val.product.discount) / 100;

                objItems.name = val.product.name;
                objItems.sku = val.product._id;
                objItems.price = Math.round(priceNew / 23176.20);
                objItems.currency = "USD";
                objItems.quantity = val.quantity;

                convertCurrency += objItems.price * objItems.quantity;

                return objItems;
            })

            console.log(`totalMoney = ${convertCurrency}`);
            res.cookie('allTotalMoney', convertCurrency);

            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:1999/payment/checkout/success",
                    "cancel_url": "http://localhost:1999/payment/checkout/fail"
                },
                "transactions": [{
                    "item_list": {
                        "items": items
                    },
                    "amount": {
                        "currency": "USD",
                        "total": convertCurrency
                    },
                    "description": "Thanh toán paypal"
                }]
            };

            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    throw error;
                } else {
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === "approval_url") {
                            res.redirect(payment.links[i].href);
                        }
                    }
                }
            });
        } else {           
            return res.redirect('/payment/checkout/success');
        }
    }
};

module.exports.checkoutSuccess = async function (req, res) {
    var idOrderPayment = req.cookies.idOrderPayment;
    const allTotalMoney = req.cookies.allTotalMoney;

    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const docOrderPayment = await orderModel.findById(idOrderPayment).then(doc => doc);
    console.log(docOrderPayment);

    if (payerId) {
        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": allTotalMoney
                }
            }]
        }
        paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
            if (error) {
                console.log(error);
                throw error;
            } else {
                res.cookie('allTotalMoney', '', {
                    maxAge: 1
                });
                await orderModel.findByIdAndUpdate(idOrderPayment, {
                    $set: {
                        paid: docOrderPayment.totalAllMoney,
                        remain: 0
                    }
                });

                var data = {
                    title: 'Đặt hàng thành công',
                    idOrder: idOrderPayment,
                    extractScripts: true
                };
                return res.render('user/checkout', data);
            }
        })
    } else {
        var data = {
            title: 'Đặt hàng thành công',
            idOrder: idOrderPayment,
            extractScripts: true
        };
        return res.render('user/checkout', data);
    }
};


module.exports.checkoutFail = async function (req, res) {
    res.cookie('allTotalMoney', '', {
        maxAge: 1
    });
    var idOrderPayment = req.cookies.idOrderPayment;
    await orderModel.findByIdAndUpdate(idOrderPayment, {
        $set: {
            status: '0'
        }
    });
    var data = {
        title: 'Đặt hàng Thất Bại',
        idOrder: null,
        extractScripts: true
    };
    return res.render('user/checkout', data);
};