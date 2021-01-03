const orderModel = require('../../model/orderPayment.model');

module.exports.index = async function(req, res) {
    const month = [1,2,3,4,5,6,7,8,9,10,11,12];
    const date = new Date(Date.now());
    const monthCurrent = date.getMonth() + 1;
    const yearCurrent = date.getFullYear();

    const data = {
        title: 'doanh thu',
        layout: './layout/layoutAdmin.ejs',
        month: month,
        monthCurrent: monthCurrent,
        yearCurrent: yearCurrent,       
        extractScripts: true
    }
    return res.render('admin/revenue', data);
}

module.exports.filterDate = async function(req, res) {
    const monthCurrent = req.query.month;
    const yearCurrent = req.query.year;   

    const docOrder = await orderModel.find({}).then(doc => doc);
    const filterOrder = docOrder.filter(item => {
        let dateBook= new Date(item.dateBook);
        let monthBook = dateBook.getMonth() + 1;
        let yearBook = dateBook.getFullYear();       
        let status = item.status;       
        return status == 4 && monthBook == monthCurrent && yearBook == yearCurrent;
    });

    var dataOrder = [];

    filterOrder.map(item => {
        if(item.paymentMethods == "thanh toán khi nhận hàng") {
            let dateBook= new Date(item.dateBook);
            let dateCurrent = dateBook.getDate();
            let objData = {};
            objData.method = "thanh toán khi nhận hàng";
            objData.totalMoney = item.totalAllMoney;
            objData.day = dateCurrent;
            dataOrder.push(objData);            
        } else {
            let dateBook= new Date(item.dateBook);
            let dateCurrent = dateBook.getDate();
            let objData = {};
            objData.method = "paypal";
            objData.totalMoney = item.totalAllMoney;
            objData.day = dateCurrent;
            dataOrder.push(objData);       
        }
        return item;
    });

    return res.send(dataOrder);
}