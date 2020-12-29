const getDataHtmlAjax = function() {
    var itemLink = document.querySelectorAll('.load-html');
    const sendAjax = function(url) {
        var bodyContent = document.querySelector('.body__content');
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState === 4 && this.status === 200){
                bodyContent.innerHTML = this.responseText;
            }
        };
        xhttp.open('GET', url, true);
        xhttp.send();
    };
    itemLink.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            var url = e.target.getAttribute('href');
            var parent = e.target;
            if(!e.target.classList.contains('load-html')) {
                parent = e.target.parentNode;
                url = parent.getAttribute('href');
            } 
            sendAjax(parent, url);
        });
    });
};
export default getDataHtmlAjax;