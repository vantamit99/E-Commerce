const ajaxSendQuantity = function() {
    console.log('ajaxsendquantity.js');
    var decrease = document.querySelectorAll('.cart__decrease');
    var increase = document.querySelectorAll('.cart__increase');
    var quantity = document.querySelectorAll('.cart__quantity');
    var idcart = '';

    decrease.forEach((item, index) => {
        if(Number(quantity[index].value) <= 1) {
            item.disabled = true;
        }
    });
    increase.forEach((item, index) => {
        if(Number(quantity[index].value) >= 20) {
            item.disabled = true;
        }
    });
    
    for(let i = 0; i < decrease.length; i++) {
        decrease[i].addEventListener('click', (e)=> {
            idcart = e.target.getAttribute('getidcart');
            changeQuantity(-1, i);
            ajaxSendNumber(idcart, quantity[i].value);
        });
    }
    for(let i = 0; i < increase.length; i++) {
        increase[i].addEventListener('click', (e)=> {
            idcart = e.target.getAttribute('getidcart');
            changeQuantity(1, i);
            ajaxSendNumber(idcart, quantity[i].value);
        });
    }
    function changeQuantity(a, index) {
        quantity[index].value = Number(quantity[index].value) + a;     
        
        if(Number(quantity[index].value) <= 1) {
            decrease[index].disabled = true;
        } else {
            decrease[index].disabled = false;
        }
    
        if(Number(quantity[index].value) >= 20) {
            increase[index].disabled = true;
        } else {
            increase[index].disabled = false;
        }
    }
    
};
function ajaxSendNumber(idcart, quantity) {
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/cart/addquantity', true);
    xhttp.onreadystatechange = function(e) {
        if(this.status === 200 && this.readyState === 4) {
            window.location.href = this.responseText;
        }
    };
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`idCart=${idcart}&quantity=${quantity}`);
}
export default ajaxSendQuantity;