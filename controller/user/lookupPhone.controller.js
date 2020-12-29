const orderModel = require('../../model/orderPayment.model');

module.exports.cartGet = async function(req, res) {
    const phone = req.cookies.phone;
    const listOrder = await orderModel.find({phone: phone}).populate('listProduct.product').then(doc => doc);    

    const data = {
        title: 'danh sach don hang',
        docOrder: listOrder,
        extractScripts: true
    }
    return res.render('user/searchPhoneOrder', data);
}

module.exports.checkPhone = async function(req, res) {    
    const phone = req.query.phone;
    const listOrder = await orderModel.find({phone: phone}).then(doc => doc);
    res.cookie('phone', phone);
    
    if(listOrder.length == 0) {
        let dataObject = {
            existPhone: false,
            msg: 'Số điện thoại không tồn tại'
        };
        let dataJson = JSON.stringify(dataObject);
        return res.send(dataJson);
    } else {
        let dataObject = {
            existPhone: true,
            url: '/lookupPhone/cart'
        };
        let dataJson = JSON.stringify(dataObject);
        return res.send(dataJson);
    } 
}
