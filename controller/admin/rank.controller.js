const specialModel = require('../../model/special.model');

module.exports.index = async function(req, res) {
    const docRank = await specialModel.find({}).then(doc => doc);

    const data = {
        title: 'Ranking',
        docRank: docRank,
        layout: './layout/layoutAdmin.ejs',
        extractScripts: true
    }
    return res.render('admin/rank', data)
}

module.exports.add = async function(req, res) {
    var nameRank = req.body.nameRank;
    var pointRank = req.body.pointRank;

    var rankNew = new specialModel();
    rankNew.nameRank = nameRank;
    rankNew.pointRank = pointRank;

    await rankNew.save();

    return res.redirect('/dashboard/rank');
}

module.exports.editGet = async function(req, res) {
    const id = req.params.id;
    const docRank = await specialModel.findById(id).then(doc => doc);
   
    const data = {
        title: 'Edit',
        docRank: docRank,
        layout: './layout/layoutAdmin.ejs',
        extractScripts: true
    };
    return res.render('admin/editRank', data);  
}
module.exports.editPost = async function(req, res) {
    const id = req.params.id;
    var nameRank = req.body.nameRank;
    var pointRank = req.body.pointRank;

    var rankNew = {};
    rankNew.nameRank = nameRank;
    rankNew.pointRank = pointRank;

    await specialModel.findByIdAndUpdate(id,rankNew).then(doc => doc);
   
    return res.redirect('/dashboard/rank');
}

module.exports.deleteGet = async function(req, res) {
    const id = req.params.id;
    const docRank = await specialModel.findById(id).then(doc => doc);

    const data = {
        title: 'Delete',
        docRank: docRank,
        layout: './layout/layoutAdmin',
        extractScripts: true
    };
    return res.render('admin/deleteRank', data);
}
module.exports.deletePost = async function(req, res) {
    const id = req.params.id;
    await specialModel.findByIdAndDelete(id);
   
    return res.redirect('/dashboard/rank');
}