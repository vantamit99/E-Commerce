const orderModel = require('../../model/orderPayment.model');
const proModel = require('../../model/product.model');
const rateModel = require('../../model/rate.model');
const replaceString = require('../../public/scripts/replaceString');

module.exports.view = async function(req, res) {
    const countProduct = await proModel.find({}).then(doc => doc);
    const countAllOrder = await orderModel.find({}).then(doc => doc);
    const docOrderCancel = await orderModel.find({status: '0'}).then(doc => doc);
    const countAllRating = await rateModel.find({}).count();

    const arrFilterDelivery = countAllOrder.filter(val => {
        var replace = replaceString(val.paymentMethods);
        return replace == replaceString('thanh toán khi nhận hàng') && val.status != '0';
    });
    const arrFilterPaypal = countAllOrder.filter(val => {
        var replace = replaceString(val.paymentMethods);
        return replace == replaceString('paypal') && val.status != '0';
    });
    const countPaymentDelivery = arrFilterDelivery.length;
    const countPaymentPaypal = arrFilterPaypal.length;
    const countOrderCancel = docOrderCancel.length;
    
    const data = {
        title: 'dashboard',
        countProduct: countProduct.length,
        countAllOrder: countAllOrder.length,
        countPaymentDelivery: countPaymentDelivery,
        countPaymentPaypal: countPaymentPaypal,
        countOrderCancel: countOrderCancel,
        countAllRating: countAllRating,
        layout: './layout/layoutAdmin.ejs',
        extractScripts: true
    };
    res.render('admin/dashboard', data);
};
