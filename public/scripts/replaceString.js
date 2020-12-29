const replaceString = function(str) {
    str = str.toLowerCase();
    str = str.replace(/á|à|ạ|ã|ả|ă|ắ|ằ|ặ|ẵ|ẳ|â|ấ|ầ|ậ|ẫ|ẩ/g, 'a');
    str = str.replace(/é|è|ẹ|ẽ|ẻ|ê|ế|ề|ệ|ễ|ể/g, 'e');
    str = str.replace(/ý|ỳ|ỵ|ỹ|ỷ/g, 'y');
    str = str.replace(/ú|ù|ụ|ũ|ủ|ư|ứ|ừ|ự|ữ|ử/g, 'u');
    str = str.replace(/í|ì|ị|ĩ|ỉ/g, 'i');
    str = str.replace(/ó|ò|ọ|õ|ỏ|ô|ố|ồ|ộ|ỗ|ổ|ơ|ớ|ờ|ợ|ỡ|ở/g, 'o');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/giày/g, 'giay');
    str = str.replace(/nũ/g, 'nu');
    str = str.replace(/ /g, '');str = str.toLowerCase();

    return str;
};
module.exports = replaceString;