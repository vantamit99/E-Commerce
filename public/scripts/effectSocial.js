const effectSocial = function() {
    var btnOpen = document.querySelector('.contact__social--open');
    var itemSocial = document.querySelectorAll('.contact__social li');
    var isClick = false;
   
    function onOpen() {       
        for(let i = 0; i < itemSocial.length; i++) {
            itemSocial[i].style.transition = "all .4s";
            itemSocial[i].style.transitionDelay = i*0.08+'s';
        }        
        itemSocial[0].style.transform = "translate(0, -58px) rotate(720deg)";
        itemSocial[1].style.transform = "translate(-46px, -45px) rotate(720deg)";
        itemSocial[2].style.transform = "translate(-58px, 0px) rotate(720deg)";
        itemSocial[3].style.transform = "translate(-46px, 45px) rotate(720deg)";
        itemSocial[4].style.transform = "translate(0, 58px) rotate(720deg)";
    }
    function onClose() {        
        itemSocial[0].style.transform = "translate(0, 0) rotate(0)";
        itemSocial[1].style.transform = "translate(0, 0) rotate(0)";
        itemSocial[2].style.transform = "translate(0, 0) rotate(0)";
        itemSocial[3].style.transform = "translate(0, 0) rotate(0)";
        itemSocial[4].style.transform = "translate(0, 0) rotate(0)";
    }

    btnOpen.addEventListener('click', function() {
        if(!isClick) {
            onOpen();            
        } else {
            onClose();            
        }
        isClick = !isClick;
    });
};
export default effectSocial;