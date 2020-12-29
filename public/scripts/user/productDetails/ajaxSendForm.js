const ajaxSendForm = function() {
    console.log('ajaxsendform.js');
    //var buy = document.querySelector('.buyNowAjax');
    var add = document.querySelector('.addCartAjax');
    var color = document.querySelectorAll('.color__value');
    var size = document.querySelectorAll('.size__value');
    var quantity = document.querySelector('.quantityPro');
    var colorVal = '';
    var sizeVal = '';
    var id = '';

    add.addEventListener('click', (e)=> {
        e.preventDefault();
        // if(!document.cookie) {
        //     window.location.href = '/auth/login';
        //     return;
        // }

        colorVal = getValue(color);
        sizeVal = getValue(size);
        id = e.target.getAttribute('getid');
        quantity = quantity.value;

        sendAjax('POST', '/cart', id, colorVal, sizeVal, quantity);
    });

    function getValue(element) {
        var value = '';
        element.forEach(item => {
            if(item.checked) {
               value = item.value;
            }
        });
        return value;
    }
};
function sendAjax(method, url, id, color, size, quantity) {
    var xhttp = new XMLHttpRequest();
    
    xhttp.open(method, url, true);
    xhttp.onreadystatechange = function(e) {
        if(this.status === 200 && this.readyState === 4) {
            window.location.href = this.responseText;
            //console.log(this.responseText);
        }
    };
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`idPro=${id}&color=${color}&size=${size}&quantity=${quantity}`);
}

export default ajaxSendForm;