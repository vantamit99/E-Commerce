module.exports.index = async function(req, res) {
    const data = {
        title: 'doanh thu',
        layout: './layout/layoutAdmin.ejs',
        extractScripts: true
    }
    return res.render('admin/revenue', data);
}