const cateModel = require('../../model/category.model');

module.exports.view = async function(req, res) {
    const docCate = await cateModel.find({}).then(doc => doc);

    const data = {
        title: 'Category',
        docCate: docCate,
        layout: './layout/layoutAdmin.ejs',
        extractScripts: true
    };
    res.render('admin/cate', data);
};
module.exports.create = async function(req, res) {
    var cateName = req.body.cateProduct;

    var cateNew = new cateModel();
    cateNew.name = cateName;
    await cateNew.save();

    return res.redirect('/dashboard/cate');
};

module.exports.editGet = async function(req, res) {
    const id = req.params.id;
    const docCate = await cateModel.findById(id).then(doc => doc);
   
    const data = {
        title: 'Edit',
        docCate: docCate,
        layout: './layout/layoutAdmin',
        extractScripts: true
    };
    return res.render('admin/editCate', data);
};
module.exports.editPost = async function(req, res) {
    const id = req.params.id;
    var valUpdate = req.body.editCateName;
    const docUpdate = await cateModel.findByIdAndUpdate(id, {name: valUpdate}).then(doc => {
        return doc;
    });
   
    return res.redirect('/dashboard/cate');
};
module.exports.deleteGet = async function(req, res) {
    const id = req.params.id;
    const docCate = await cateModel.findById(id).then(doc => doc);

    const data = {
        title: 'Delete',
        docCate: docCate,
        layout: './layout/layoutAdmin',
        extractScripts: true
    };
    return res.render('admin/deleteCate', data);
};
module.exports.deletePost = async function(req, res) {
    const id = req.params.id;
    const docDel = await cateModel.findByIdAndDelete(id).then(doc => {
        return doc;
    });
   
    return res.redirect('/dashboard/cate');
};