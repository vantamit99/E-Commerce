const orderModel = require('../../model/orderPayment.model');
const replaceString = require('../../public/scripts/replaceString');

module.exports.delivery = async function(req, res) {
    const countAllOrder = await orderModel.find({}).then(doc => doc);
    const docDelivery = countAllOrder.filter(val => {
        var replace = replaceString(val.paymentMethods);
        return replace == replaceString('thanh toán khi nhận hàng') && val.status != '0';
    });
    //console.log(docDelivery);

    const data = {
        title: 'Payment On Delivery',
        titleBlock: 'Thanh Toán Khi Nhận Hàng',
        doc: docDelivery,
        layout: './layout/layoutAdmin.ejs',
        extractScripts: true
    };
    return res.render('admin/payment/payment', data);
};

module.exports.paypal = async function(req, res) {
    const countAllOrder = await orderModel.find({}).then(doc => doc);
    const docPaypal = countAllOrder.filter(val => {
        var replace = replaceString(val.paymentMethods);
        return replace == replaceString('paypal') && val.status != '0';
    });
    //console.log(docPaypal);

    const data = {
        title: 'Payment Paypal',
        titleBlock: 'Thanh Toán Bằng Paypal',
        doc: docPaypal,
        layout: './layout/layoutAdmin.ejs',
        extractScripts: true
    };
    return res.render('admin/payment/payment', data);
};

module.exports.cancel = async function(req, res) {
    const docOrder = await orderModel.find({status: '0'}).then(doc => doc);

    const data = {
        title: 'Payment Cancel',
        titleBlock: 'Thanh Toán Bị Hủy',
        doc: docOrder,
        layout: './layout/layoutAdmin.ejs',
        extractScripts: true
    };
    return res.render('admin/payment/payment', data);
};

module.exports.details = async function(req, res) {
    const id = req.params.id;
    const docOrderPayment = await orderModel.findById(id).populate('listProduct.product').then(doc => doc);
    const docListProduct = docOrderPayment.listProduct;
    const idStatus = docOrderPayment.status;
    

    const data = {
        title: 'Payment Details',
        titleBlock: 'Chi Tiếc Thông Tin',
        doc: docOrderPayment,
        docListProduct: docListProduct,
        idStatus: idStatus,
        layout: './layout/layoutAdmin.ejs',
        extractScripts: true
    };
    return res.render('admin/payment/details', data);
};