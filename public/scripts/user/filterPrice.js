const filterPrice = function() {
    var placeRender = document.querySelector('.product');
    var filterPrice = document.querySelectorAll('.filterPrice__button');
    var priceMinimum = 0;
    var priceMaximum = 0;
    filterPrice.forEach(item => {
        item.addEventListener('click', e => {
            let buttonCurrent = e.target;
            cancelActive();
            buttonCurrent.classList.add('active');

            if(buttonCurrent.classList.contains('filterPrice__all')) {
                let url = "/filterPrice/all";
                sendPriceAjax(url);

            }
            else if(buttonCurrent.classList.contains('filterPrice__small')) {
                priceMinimum = 0; 
                priceMaximum = 300000;
                let url = `/filterPrice/small?minimum=${priceMinimum}&maximum=${priceMaximum}`;
                sendPriceAjax(url);
            }
            else if(buttonCurrent.classList.contains('filterPrice__medium')) {
                priceMinimum = 301000;
                priceMaximum = 700000;
                let url = `/filterPrice/medium?minimum=${priceMinimum}&maximum=${priceMaximum}`;
                sendPriceAjax(url);
            } 
            else {
                priceMinimum = 701000;
                let url = `/filterPrice/high?minimum=${priceMinimum}`;
                sendPriceAjax(url);
            }
        });
    });

    function cancelActive() {
        for(let i = 0; i < filterPrice.length; i++) {
            filterPrice[i].classList.remove('active');
        }
    }
    function sendPriceAjax(url) {
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET', url, true);
        xhttp.onreadystatechange = function() {
            if(this.status === 200 && this.readyState === 4) {
                placeRender.innerHTML = this.responseText;
            }
        }
        xhttp.send();
    }
};

document.addEventListener('DOMContentLoaded', function() {
    filterPrice();
});