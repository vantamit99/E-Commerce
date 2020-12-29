const cateModel = require('../../model/category.model');
const proModel = require('../../model/product.model');

module.exports.view = async function(req, res) {
    var docCate = await cateModel.find({}).then(doc => doc);
    var docPro = await proModel.find({}).then(doc => doc);
    let arrCate = [];
    arrCate = docCate.map(val => val.name);
    
    const data = {
        title: 'Product',
        infoPro: docPro,
        cate: arrCate,
        layout: './layout/layoutAdmin.ejs',
        extractScripts: true,
    };
    return res.render('admin/product', data);
};

module.exports.createPost = async function(req, res) {
    if(req.files.length == 0) {
        return res.status(400).send('Must upload image');
    }
    if(req.body.size == undefined) {
        return res.status(400).send('Must choose size');
    }
    var name = req.body.proName;
    var price = req.body.proPrice;
    var quantity = req.body.proQuantity;
    var discount = req.body.proDiscount;
    var cateVal = req.body.proCate;
    var description = req.body.proDescription;
    var arrImage = req.files;
    var size = req.body.size;
    var shoesColor = [];
    
    // filter arr all image have name is shoes white and black
    const arrImageColor = arrImage.filter(val => {
        return val.fieldname === 'shoesWhite' || val.fieldname === 'shoesBlack';
    });
    // filter arr image shoes white
    const arrShoesWhite = arrImage.filter(val => {
        return val.fieldname === 'shoesWhite';
    });
    // filter arr image shoes black
    const arrShoesBlack = arrImage.filter(val => {
        return val.fieldname === 'shoesBlack';
    });
   
    const arrImageColorFilename = arrImageColor.map(val => {
        return val.filename;
    });
    if(arrShoesWhite.length === 0) {
        if(arrShoesBlack.length === 0) {
            shoesColor = [];
        } else {
            shoesColor = [
                {
                    color: 'Màu đen',
                    image: arrShoesBlack[0].filename
                }
            ];
        }
    }
    if(arrShoesBlack.length === 0) {
        if(arrShoesWhite.length === 0) {
            shoesColor = [];
        } else {
            shoesColor = [
                {
                    color: 'Màu trắng',
                    image: arrShoesWhite[0].filename
                }
            ];
        }
    }
    if(arrShoesBlack.length != 0 && arrShoesWhite.length != 0) {
        shoesColor = [
            {
                color: 'Màu trắng',
                image: arrShoesWhite[0].filename
            },
            {
                color: 'Màu đen',
                image: arrShoesBlack[0].filename
            }
        ];
    }
    
    const idCate = await cateModel.findOne({name: cateVal}).then(doc => {
        return doc._id;
    });
    var proNew = new proModel();
    proNew.name = name;
    proNew.price = price;
    proNew.quantity = quantity;
    proNew.discount = discount;
    proNew.description = description;
    proNew.dateCreate = Date.now();
    proNew.cate = idCate;
    proNew.image = arrImage[0].filename;
    proNew.imageSub = arrImageColorFilename;
    proNew.size = size;
    proNew.color = shoesColor;
    
    const createPro = proNew.save().then(doc => {
        return doc._id;
    });
    const idPro = await createPro;

    const updateIdProForCate = await cateModel.findOneAndUpdate({name: cateVal}, {$push: {product: idPro}}).then(doc => {
        return doc;
    }).catch(err => {
        console.log(err);
        return res.sendStatus(400);
    });
    console.log(updateIdProForCate);
    return res.redirect('/dashboard/product');
};

module.exports.details = async function(req, res) {
    const id = req.params.id;
    const docPro = await proModel.findById(id).populate('cate').then(doc => doc);

    const data = {
        title: 'Details',
        infoPro: docPro,
        layout: './layout/layoutAdmin.ejs',
        extractScripts: true
    };
    return res.render('admin/detailsPro', data);
};

module.exports.editGet = async function(req, res) {
    const id = req.params.id;
    const  docPro = await proModel.findById(id).then(doc => doc);

    const data = {
        title: 'edit',
        infoPro: docPro,
        layout: './layout/layoutAdmin.ejs',
        extractScripts: true
    };
    return res.render('admin/editPro', data);
};
module.exports.editPost = async function(req, res) {
    var id = req.params.id;
    var name = req.body.proName;
    var price = req.body.proPrice;
    var quantity = req.body.proQuantity;
    var discount = req.body.proDiscount;
    var description = req.body.proDescription;
    var size = req.body.size;
    var image;
    if(req.files.length === 0) {
        image = await proModel.findById(id).then(doc => doc.image);
    } else {
        image = req.files[0].filename;
    }
    var proNew = {};
    proNew.name = name;
    proNew.price = price;
    proNew.quantity = quantity;
    proNew.discount = discount;
    proNew.description = description;
    proNew.dateCreate = Date.now();
    proNew.image = image;
    proNew.size = size;
    
    await proModel.findByIdAndUpdate(id, proNew).then(doc => doc);
    
    return res.redirect('/dashboard/product');
};

module.exports.deleteGet = async function(req, res) {
    const id = req.params.id;
    const docPro = await proModel.findById(id).then(doc => doc);

    const data = {
        title: 'Delete',
        infoPro: docPro,
        layout: './layout/layoutAdmin.ejs',
        extractScripts: true
    };
    return res.render('admin/deletePro', data);
};
module.exports.deletePost = async function(req, res) {
    const id = req.params.id;
    const removeIdPro = async function() {
        var arrProductAfterRemove = await cateModel.find({product: id}).then(doc => {
            var arrDoc = doc.map(val => {
                return val.product;
            });
            var arrProduct = arrDoc[0];
            var index = arrProduct.indexOf(id);
            var spl = arrProduct.splice(index, 1);
            return arrProduct;
        });
        
        return cateModel.updateOne({product: id}, {product: arrProductAfterRemove});
    };
   
    await proModel.findByIdAndDelete(id).then(val => {
        removeIdPro();
    });

    return res.redirect('/dashboard/product');
};
