const changeImages = function() {
    console.log('changeimage.js');
    var listImg =  document.querySelectorAll('.list__imgSub');
    var represent = document.querySelector('.image__representPro');
    listImg.forEach(item => {
        item.addEventListener('click', e => {
            represent.setAttribute('src', e.target.getAttribute('src'));
        });
    });
};
export default changeImages;