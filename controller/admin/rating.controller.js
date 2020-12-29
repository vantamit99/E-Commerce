const rateModel = require('../../model/rate.model');

module.exports.view = async function(req, res) {
    const docRating = await rateModel.find({}).populate('product')
    .populate({
        path: 'cus',
        populate: {
            path: 'user'
        }
    })
    .then(doc => doc);
    //console.log(docRating);

    const data = {
        title: 'Danh sách đánh giá',
        layout: './layout/layoutAdmin.ejs',
        docRating: docRating,
        extractScripts: true
    };
    return res.render('admin/rating', data);
};