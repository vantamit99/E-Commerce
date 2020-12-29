const commentModel = require('../../model/comment.model');
const proModel = require('../../model/product.model');

module.exports.commentPost = async function(req, res) {
    const idPro = req.body.idPro;
    const question = req.body.question;
    const idCus = req.cookies.idCus;

    var commentNew = new commentModel();

    if(question == "") {
        return res.redirect(`/product/${idPro}`)
    }

    if(idCus == "undefined") {
        commentNew.comment = question;
        commentNew.cus = "";
        commentNew.product = idPro;
        await commentNew.save();
        return res.redirect(`/product/${idPro}`)
    }
    commentNew.comment = question;
    commentNew.cus = idCus;
    commentNew.product = idPro;
    await commentNew.save(async (err, doc)=> {
        var idComment = doc._id;
        await proModel.findByIdAndUpdate(idPro, {$push: {comment: idComment}});
    });

    return res.redirect(`/product/${idPro}`)
}