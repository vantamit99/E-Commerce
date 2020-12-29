const proModel = require('../../model/product.model');
const replaceString = require('../../public/scripts/replaceString');

module.exports.get = async function(req, res) {
    const strSearch = req.query.search;
    const listPro = await proModel.find({}).populate('rate').populate('cate').then(doc => {return doc});
    const replaceStrSearch = replaceString(strSearch);

    const filterSearch = listPro.filter(val => {
        var proName = val.name;
        var cateName = val.cate.name;
        var price = val.price;
        var discount = val.discount;
        var priceSale = String(price - price*discount/100); 
        var replaceProName = replaceString(proName);
        var replaceCateName = replaceString(cateName);
       
        return replaceProName.indexOf(replaceStrSearch) != -1 || replaceCateName.indexOf(replaceStrSearch) != -1 || priceSale == replaceStrSearch;
    });
    
    const data = {
        title: `Tìm kiếm: ${strSearch}`,
        listPro: filterSearch,
        extractScripts: true
    };
    return res.render('user/search', data);
};