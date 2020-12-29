const jwt = require('jsonwebtoken');
const userModel = require('../model/user.model');
const cusModel = require('../model/customer.model');

module.exports.authRedirect = function(req, res, next) {
    res.redirect("auth/login");
};
module.exports.registerGet = function(req, res, next) {
    const data = {
        title: 'Đăng Ký',
        error: [],
        extractScripts: true
    };
    res.render("auth/register", data);
};
module.exports.registerPost =  function(req, res, next) {
    var userNew = new userModel();
    var cusNew = new cusModel();

    var fn = req.body.firstname;
    var ln = req.body.lastname;
    var phone = req.body.phone;
    var email = req.body.email;
    var password = req.body.password;

    const createUser = function() {
        return userNew.save().then(doc => {
            return doc;
        });
    };

    const createCus = function() {
        return cusNew.save().then(doc => {
            return doc;
        });
    };

    const runUpdate = async function() {
        userNew.firstname = fn;
        userNew.lastname = ln;
        userNew.phone = phone;
        userNew.email = email;
        userNew.password = password;
        var docUser = await createUser();
        console.log(`docUser = ${docUser}`);
        
        cusNew.isMember = true;
        cusNew.image = '/assets/images/iconuser.jpg';
        cusNew.deliveryAddress = ' ';
        cusNew.phone = docUser.phone;
        cusNew.expense = 0;
        cusNew.user = docUser._id;
        var docCus = await createCus();
        console.log(`docCus = ${docCus}`);

        // collection user update id cus ref
        var idUser = docUser._id;
        var idCus = docCus._id;
        //console.log(`idUser = ${idUser} and idCus = ${idCus}`);
        userModel.findByIdAndUpdate(idUser, {cus: idCus}, (err, doc) => {
            if(err) {
                userModel.findByIdAndDelete(idUser);
                cusModel.findByIdAndDelete(idCus);
                return res.sendStatus(400);
            }
            //console.log(docUser.phone);
            //console.log(`doc user update = ${doc}`);
            res.redirect('/auth/login');
        });
    };
    runUpdate();
};
module.exports.loginGet = function(req, res, next) {
    const data = {
        title: 'Đăng Nhập',
        error: [],
        extractScripts: true
    };
    res.render('auth/login', data);
};
module.exports.loginPost = async function(req, res, next) {
    // handle token jwt
    const email = req.body.email;
    
    const token =  jwt.sign({email}, 'secretkey');
    res.cookie('authCookie', token, {maxAge: 9000000, httpOnly: true});
    
    const docCus = await userModel.findOne({email: email}).populate('cus').then(doc => {return doc});
    const idCus = docCus.cus._id;
    res.cookie('idCus', idCus);
    
    // === redirect === //
    if(email === "admin@gmail.com") {
        return res.redirect('/dashboard');
    } else {
        return res.redirect('/');
    }
};
module.exports.logout = function(req, res, next) {
    res.cookie('authCookie', '', {maxAge: 1});
    res.cookie('idCus', '', {maxAge: 1});
    res.cookie('idCartDetails', '', {maxAge: 1});
    res.cookie('cartProduct', '', {maxAge: 1});
    return res.redirect('/');
};

module.exports.changePassGet = async function(req, res) {

    const data = {
        title: 'Thay đổi mật khẩu',
        extractScripts: true
    }
    return res.render('auth/changePassword', data);
}
module.exports.changePassPost = async function(req, res) {
    var passOld = req.body.passOld;
    var passNew = req.body.passNew;
    var confirmPass = req.body.confirmPass;
    var idCus = req.cookies.idCus;

    const dataCus = await cusModel.findById(idCus).populate('user').then(doc => doc);
    const idUser = dataCus.user._id;
    const password = dataCus.user.password;

    const data = [];
    if(password != passOld) {
        data.push({
            isErr: true,
            msg: 'Mật khẩu cũ không đúng'
        })
    } else {
        data.push({
            isErr: false
        });
        await userModel.findByIdAndUpdate(idUser, {$set: {password: passNew}});
    }        
    return res.send(data);
}
