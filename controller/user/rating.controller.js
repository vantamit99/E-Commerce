const orderModel = require('../../model/orderPayment.model');
const rateModel = require('../../model/rate.model');
const proModel = require('../../model/product.model');

module.exports.view = async function(req, res) {
    const idListProduct = req.params.id;
    const docOrder = await orderModel.find({}).populate('listProduct.product').then(val => val);
    const arrProduct = [];

    const docOrderPayment = docOrder.filter(item => {
        const arrListProduct = item.listProduct.filter(val => {
            if(val._id == idListProduct) {
                arrProduct.push(val);
            }
            return val._id == idListProduct;
        });
        
        return arrListProduct.length > 0;
    });
    const idOrderPayment = docOrderPayment[0]._id;

    const docProduct = arrProduct[0];
    //console.log(docProduct);

    const data = {
        title: 'Đánh giá',
        docProduct: docProduct,
        idOrderPayment: idOrderPayment,
        idListProduct: idListProduct,
        extractScripts: true
    };
    return res.render('user/rating', data);
};

module.exports.history = async function(req, res) {
    const idCus = req.cookies.idCus;
    
    const docRating = await rateModel.find({cus: idCus}).populate('product').then(doc => doc);
    
    const data = {
        title: 'Lịch sử đánh giá',
        docRating: docRating,
        extractScripts: true
    };
    return res.render('user/historyRating', data);
};

module.exports.save = async function(req, res) {
    const star = req.body.star;
    const review = req.body.review;
    const idPro = req.body.idPro;
    const idCus = req.cookies.idCus;
    const idOrderPayment = req.body.idOrderPayment;
    const idListProduct = req.body.idListProduct;

    var rateNew = new rateModel();
    rateNew.star = star;
    rateNew.review = review;
    rateNew.cus = idCus;
    rateNew.product = idPro;

    await rateNew.save(async (err, doc)=> {
        var idRate = doc._id;
        await proModel.findByIdAndUpdate(idPro, {$push: {rate: idRate}})
    });

    await orderModel.updateOne({"_id": idOrderPayment, "listProduct._id": idListProduct}, {
        $set: {
            "listProduct.$.isRating": true
        }
    });

    return res.redirect('/rating/history');
};