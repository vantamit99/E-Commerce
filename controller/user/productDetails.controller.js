const proModel = require('../../model/product.model');
const rateModel = require('../../model/rate.model');
const userModel = require('../../model/user.model');
const commentModel = require('../../model/comment.model');

module.exports.details = async function(req, res) {
    var starFive = 0;
    var starFour = 0;
    var starThree = 0;
    var starTwo = 0;
    var starOne = 0;
    var resultAverageStar = 0; 
    var perStarFive = 0;
    var perStarFour = 0;
    var perStarThree = 0;
    var perStarTwo = 0;
    var perStarOne = 0;
    const id = req.params.id;
    const getProId = await proModel.findById(id).then(doc => {
        return doc;
    });
    //console.log(getProId)
    const listRate = await rateModel.find({product: id}).then(doc => doc);
    // === rating === //
    (function countStar(){
        listRate.map(item => {
            if(item.star == 5) {
                starFive++;
            }
            else if(item.star == 4) {
                starFour++;
            }
            else if(item.star == 3) {
                starThree++;
            }
            else if(item.star == 2) {
                starTwo++;
            }
            else {
                starOne++;
            }
            return item;
        })
    }());

    const numberRating = listRate.length;
    if(numberRating > 0) {
        resultAverageStar = averageStar();
        perStarFive = perAverageStar(starFive);
        perStarFour = perAverageStar(starFour);
        perStarThree = perAverageStar(starThree);
        perStarTwo = perAverageStar(starTwo);
        perStarOne = perAverageStar(starOne);
    }
    const perTotalStar = resultAverageStar / 5 * 100;

    
    function averageStar() {
        let sum = listRate.map(item => {
            return item.star;
        }).reduce((total, current)=> {
            return total + current;
        });

        return sum/numberRating;
    }
    function perAverageStar(numStar) {
        return numStar / numberRating * 100;
    }

    // === review === //
    //console.log(listRate);
    const arrReview = listRate.map(async item => {
        var idCus = "";
        var fullname = "";
        var data = {};

        idCus = item.cus;
        fullname = await userModel.findOne({cus: idCus}).then(doc => `${doc.firstname} ${doc.lastname}`);

        // === add data === //
        data.review = item.review;
        data.star = item.star;
        data.fullname = fullname;

        return data;
    });
    const listReview = await Promise.all(arrReview);
    //console.log(listReview);

    // === question === //
    
    const listQuestion = await commentModel.find({product: id}).populate({
        path: "cus",
        populate: {
            path: "user"
        }
    }).then(doc => doc);
    //console.log(listQuestion);

    const data = {
        title: getProId.name,
        starFive: starFive,
        starFour: starFour,
        starThree: starThree,
        starTwo: starTwo,
        starOne: starOne,
        numberRating: numberRating,
        resultAverageStar: resultAverageStar,
        perTotalStar: perTotalStar,
        perStarFive: perStarFive,
        perStarFour: perStarFour,
        perStarThree: perStarThree,
        perStarTwo: perStarTwo,
        perStarOne: perStarOne,
        listQuestion: listQuestion,
        listReview: listReview,
        infoPro: getProId,
        extractScripts: true
    };
    return res.render('user/productDetails', data);
};
