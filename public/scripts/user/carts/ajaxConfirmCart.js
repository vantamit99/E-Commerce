const confirmCart = function() {
    console.log('ajaxconfirmcart.js');
    var submit = document.querySelector('.confirmCart');
    var code = document.getElementById('codesale');
    var idCartDetails = '';

    submit.addEventListener('click', function(e) {
        e.preventDefault();
        idCartDetails = e.target.getAttribute('getidcartdetails');
        document.cookie = 'idCartDetails='+idCartDetails;
        code = code.value;
        ajaxConfirmCart(idCartDetails, code);
    });
};

function ajaxConfirmCart(id, code) {
    var xhttp = new XMLHttpRequest();

    xhttp.open('post', '/payment', true);
    xhttp.onreadystatechange = function(e) {
        if(this.status === 200 && this.readyState === 4) {
            window.location.href = this.responseText;
        }
    };
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`idCartDetails=${id}&code=${code}`);
}
export default confirmCart;