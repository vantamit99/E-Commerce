const statusOrderModel = require('../../model/statusOrder.model');
const orderModel = require('../../model/orderPayment.model');

module.exports.view = async function (req, res) {
    const docStatus = await statusOrderModel.find({}).then(doc => doc);

    const data = {
        title: 'Status',
        docStatus: docStatus,
        layout: './layout/layoutAdmin.ejs',
        extractScripts: true
    };
    return res.render('admin/status', data);
};

module.exports.createPost = async function(req, res) {
    var idStatus = req.body.idStatus;
    var nameStatus = req.body.nameStatus;
    
    var statusNew = new statusOrderModel();
    statusNew.idStatus = idStatus;
    statusNew.nameStatus = nameStatus;
    await statusNew.save();
    
    return res.redirect('/dashboard/status');
};

module.exports.editGet = async function(req, res) {
    const id = req.params.id;
    
    const docStatus = await statusOrderModel.findById(id).then(doc => doc);
   
    const data = {
        title: `Edit`,
        docStatus: docStatus,
        layout: './layout/layoutAdmin.ejs',
        extractScripts: true
    };

    return res.render('admin/editStatus', data);
};
module.exports.editPost = async function(req, res) {
    const id = req.params.id;
    const idStatus = req.body.editIdStatus;
    const nameStatus = req.body.editNameStatus;

    const dataUpdate = {
        idStatus: idStatus,
        nameStatus: nameStatus
    };
    
    await statusOrderModel.findByIdAndUpdate(id, {$set: dataUpdate});

    return res.redirect('/dashboard/status');
};

module.exports.deleteGet = async function(req, res) {
    const id = req.params.id;
    
    const docStatus = await statusOrderModel.findById(id).then(doc => doc);
   
    const data = {
        title: `Delete`,
        docStatus: docStatus,
        layout: './layout/layoutAdmin.ejs',
        extractScripts: true
    };

    return res.render('admin/deleteStatus', data);
};
module.exports.deletePost = async function(req, res) {
    const id = req.params.id;

    await statusOrderModel.findByIdAndDelete(id);

    return res.redirect('/dashboard/status');
};

module.exports.update = async function(req, res) {
    const idStatus = req.body.status;
    const idOrderPayment = req.body.idOrderPayment;
    await orderModel.findByIdAndUpdate(idOrderPayment, {$set: {status: idStatus}});

    const data = {
        title: 'Update Status',
        layout: './layout/layoutAdmin.ejs',
        extractScripts: true
    };

    return res.redirect(`/dashboard/payment/details/${idOrderPayment}`);
};