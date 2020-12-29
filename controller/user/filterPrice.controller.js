const proModel = require('../../model/product.model');

module.exports.all = async function(req, res) {
    const listPro = await proModel.find({}).populate('rate').then(doc => doc);
    const data = {
        layout: './layout/layoutNull.ejs',
        listPro: listPro,
    };
    res.render('partial/productItem', data);
}
module.exports.small = async function(req, res) {
    const minimum = req.query.minimum;
    const maximum = req.query.maximum;
    const listPro = await proModel.find({}).populate('rate').then(doc => doc);

    const filterPrice = listPro.filter(item => item.price > minimum && item.price < maximum);
   
    const data = {
        layout: './layout/layoutNull.ejs',
        listPro: filterPrice,
    };
    res.render('partial/productItem', data);
}
module.exports.medium = async function(req, res) {
    const minimum = req.query.minimum;
    const maximum = req.query.maximum;
    const listPro = await proModel.find({}).populate('rate').then(doc => doc);

    const filterPrice = listPro.filter(item => item.price > minimum && item.price < maximum);
   
    const data = {
        layout: './layout/layoutNull.ejs',
        listPro: filterPrice,
    };
    res.render('partial/productItem', data);
}
module.exports.high = async function(req, res) {
    const minimum = req.query.minimum;
    //console.log(minimum);
    const listPro = await proModel.find({}).populate('rate').then(doc => doc);

    const filterPrice = listPro.filter(item => item.price > minimum);
    
    //console.log(filterPrice);

    const data = {
        layout: './layout/layoutNull.ejs',
        listPro: filterPrice,
    };
    res.render('partial/productItem', data);
}