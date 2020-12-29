const orderModel = require('../../model/orderPayment.model');

module.exports.history = async function(req, res) {
    const idCus = req.cookies.idCus;
    const docOrder = await orderModel.find({cus: idCus}).populate('listProduct.product').then(doc => doc);
    console.log(docOrder);
    const data = {
        title: 'Lịch sử đơn hàng',
        docOrder: docOrder,
        extractScripts: true
    };
    return res.render('user/historyOrder', data);
};

module.exports.details = async function(req, res) {
    const id = req.params.id;
    const docOrder = await orderModel.findById(id).populate('listProduct.product').then(doc => doc);

    const data = {
        title: 'Lịch sử đơn hàng',
        docOrder: docOrder,
        extractScripts: true
    };
    return res.render('user/historyOrderDetails', data);
};

module.exports.delete = async function(req, res) {
    const id = req.params.id;

    await orderModel.findByIdAndUpdate(id, {$set: {status: '0'}});
    
    return res.redirect(`/order/history`);
};