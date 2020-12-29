const commentModel = require('../../model/comment.model');

module.exports.repPost = async function(req, res) {
    const idPro = req.body.idPro;
    const idComment = req.body.idComment;
    const repQuestion = req.body.updateRepQ;

    await commentModel.findByIdAndUpdate(idComment, {$set: {rep: repQuestion}});

    return res.redirect(`/product/${idPro}`);
}