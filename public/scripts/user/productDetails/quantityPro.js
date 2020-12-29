const quantityProduct = function() {
    console.log('quantitypro.js');
    var decrease = document.querySelector('.decrease');
    var increase = document.querySelector('.increase');
    var quantity = document.querySelector('.quantityPro');
    var err = document.querySelector('.quantity__error');
    var quantityVal = Number(quantity.value);
    
    const quantityMax = Number(quantity.getAttribute('max'));

    if(quantityVal >= 1) {
        decrease.disabled = true;
    }
    decrease.addEventListener('click', function() {
        changeQuantity(-1);
    });
    increase.addEventListener('click', function() {
        changeQuantity(+1);
    });
    quantity.addEventListener('change', function() {
        quantityVal = Number(quantity.value);
        if(/[a-zA-z]/g.test(quantity.value)) {
            err.innerHTML = 'không nhập chữ';
            err.style.padding = '4px 7px';
        } else {
            err.innerHTML = '';
            err.style.padding = '0';
        }
        if(quantityVal < 1) {
            quantity.value = 1;
            quantityVal = 1;
        }

        if(quantityVal > quantityMax) {
            quantity.value = quantityMax;
            quantityVal = quantityMax;
        }

        if(quantityVal <= 1) {
            decrease.disabled = true;
        } else {
            decrease.disabled = false;
        }

        if(quantityVal >= quantityMax) {
            increase.disabled = true;
        } else {
            increase.disabled = false;
        }
    });
    function changeQuantity(a) {
        quantityVal = quantityVal + a;
        if(quantityVal <= 1) {
            decrease.disabled = true;
        } else {
            decrease.disabled = false;
        }

        if(quantityVal >= quantityMax) {
            increase.disabled = true;
        } else {
            increase.disabled = false;
        }
        quantity.value = quantityVal;
    }
   
};

export default quantityProduct;