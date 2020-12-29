const proModel = require('../../model/product.model');
const replaceString = require('../../public/scripts/replaceString');

module.exports.shoesboy = async function(req, res) {
    const listPro = await proModel.find({}).populate('cate').populate('rate').then(doc => {return doc});

    const filterSearch = listPro.filter(val => {
        var cateName = val.cate.name;
        var replaceCateName = replaceString(cateName);
       
        return replaceCateName == "giaynam";
    });
    
    const data = {
        title: 'Giày Nam',
        listPro: filterSearch,
        extractScripts: true
    };
    return res.render('user/search', data);
};

module.exports.shoesgirl = async function(req, res) {
    const listPro = await proModel.find({}).populate('cate').then(doc => {return doc});

    const filterSearch = listPro.filter(val => {
        var cateName = val.cate.name;
        var replaceCateName = replaceString(cateName);
       
        return replaceCateName == "giaynu";
    });
    
    const data = {
        title: 'Giày Nữ',
        listPro: filterSearch,
        extractScripts: true
    };
    return res.render('user/search', data);
};