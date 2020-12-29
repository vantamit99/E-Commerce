const cusModel = require('../../model/customer.model');

module.exports.index = async function(req, res) {
    const listAccount = await cusModel.find({}).populate('user').then(doc => doc);
    const listCustomer = listAccount.filter(item => {
        return item.user.email != "admin@gmail.com";
    });
    //console.log(listCustomer);

    const data = {
        title: 'Quản Lý Khách Hàng',
        layout: './layout/layoutAdmin.ejs',
        listCus: listCustomer,
        extractScripts: true
    }
    return res.render('admin/customer', data);
}