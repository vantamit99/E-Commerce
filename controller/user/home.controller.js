const proModel = require('../../model/product.model');
const userModel = require('../../model/user.model');
const cusModel = require('../../model/customer.model');
const specialModel = require('../../model/special.model');
const pointsModel = require('../../model/cumulativePoint.model');

module.exports.index = async function(req, res) {
    const listPro = await proModel.find({}).populate('rate').then(doc => {
        return doc;
    });
    //console.log(listPro);

    const data = {
        title: 'GrHKT.com - Giày & Dép',
        listPro: listPro,
        extractScripts: true
    };
    res.render('user/home', data);
};

module.exports.profileGet = async function(req, res) {
    const idCus = req.cookies.idCus;
    const docCusModel = await cusModel.findById(idCus).populate('user').then(doc => doc);
    const isSaveProfile = req.cookies.isSaveProfile;
    const cusPoint = await pointsModel.findOne({cus: idCus}).then(doc => doc);
    const listSpecial = await specialModel.find({}).then(doc => doc);

    if(cusPoint == null) {
        // khach hang chua co diem tich luy            
        var hasPoint = false;      
        var dataRank = {};

        dataRank.name = "Vô Danh";
        dataRank.image = "/assets/images/anonymous.png";
        dataRank.pointCurrent = 0;
        dataRank.rankNext = rankSmallest();
        dataRank.pointRemain = rankSmallest().pointRank;
        dataRank.perProcess = 0*100/rankSmallest().pointRank;    

        console.log(dataRank);
        function rankSmallest() {
            let arrPointRank = listSpecial.map(item => item.pointRank);
            return listSpecial.filter(item => {
                let minPoint = Math.min(...arrPointRank);
                return item.pointRank === minPoint;
            })[0];   
        }    
    } else {
        // khach hang co diem tich luy       
        var hasPoint = true;
        var dataRank = {};
        var pointCurrent = cusPoint.points;
        //let arrPointRank = listSpecial.map(item => item.pointRank);
        // var minPointRank = Math.min(...arrPointRank);
        // var maxPointRank = Math.max(...arrPointRank);
        
        let pointNext = getRankNext().pointRank;
        var listRankSmallNext = listSpecial.filter((item, index) => {
            return item.pointRank < pointNext;
        })
        if(listRankSmallNext.length >= 1) {
            var rankCurrent = listRankSmallNext[listRankSmallNext.length - 1];            
            dataRank.name = rankCurrent.nameRank;
            dataRank.pointCurrent = pointCurrent;
            dataRank.rankNext = getRankNext();
            dataRank.pointRemain = getRankNext().pointRank - pointCurrent;
            dataRank.perProcess = pointCurrent*100/getRankNext().pointRank;   
            
            console.log(dataRank);
            if(rankCurrent.nameRank == "Bronze") {        
                dataRank.image = "/assets/images/bronze.png";
            }
            else if(rankCurrent.nameRank == "Silver") {        
                dataRank.image = "/assets/images/silver.png";
            }
            else if(rankCurrent.nameRank == "Gold") {
                dataRank.image = "/assets/images/gold.png";
            }
            else if(rankCurrent.nameRank == "Diamond") {
                dataRank.image = "/assets/images/diamond.png";
            } else {               
                dataRank.image = "/assets/images/platinum.png";
            }
        } else {
            dataRank.name = "Vô Danh";
            dataRank.image = "/assets/images/anonymous.png";
            dataRank.pointCurrent = pointCurrent;
            dataRank.rankNext = getRankNext();
            dataRank.pointRemain = getRankNext().pointRank - pointCurrent;
        }       
        function getRankNext() {
            let arrRankNext = listSpecial.filter(item => {
                return item.pointRank > pointCurrent;
            });
            var arrRankNextFirst = arrRankNext[0];
            return arrRankNextFirst;            
        }
    }

    const data = {
        title: 'Sửa thông tin cá nhân',
        docCus: docCusModel,
        hasPoint: hasPoint,        
        dataRank: dataRank,        
        saveSuccess: isSaveProfile,
        extractScripts: true
    };
    return res.render('user/profile', data);
};
module.exports.profilePost = async function(req, res) {
    const idCus = req.cookies.idCus;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const deliveryAddress = req.body.deliveryAddress;
    const phone = req.body.phone;
    var image = req.files[0];
    var imageCurrent = '';
    const isSaveProfile = true;
    res.cookie("isSaveProfile", isSaveProfile);

    if(image == undefined) {
        imageCurrent = await cusModel.findById(idCus).then(doc => doc.image);
        if(imageCurrent != '/assets/images/iconuser.jpg') {
            image = imageCurrent;
        } else {
            image = '/assets/images/iconuser.jpg';
        }
    } else {
        image = `/assets/uploads/${image.filename}`;
    }
    const dataUpdateCus = {
        deliveryAddress: deliveryAddress,
        phone: phone,
        image: image
    };
    const dataUpdateUser = {
        firstname: firstname,
        lastname: lastname
    };
    await cusModel.findByIdAndUpdate(idCus, {$set: dataUpdateCus});
    await userModel.findOneAndUpdate({cus: idCus}, {$set: dataUpdateUser});

    return res.redirect('/profile');
};

module.exports.promotion = async function(req, res) {
    const listSpecial = await specialModel.find({}).then(doc => doc);
    console.log(listSpecial);

    const data = {
        title: 'Ưu đãi',        
        listSpecial: listSpecial,
        extractScripts: true
    }
    return res.render('user/promotion', data);
}