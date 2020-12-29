const loading = function() {
    var wrapper = document.querySelector('.wrapper');
    var loading = document.querySelector('.loading');

    window.onload = function() {
        wrapper.style.display = 'block';
        loading.style.display = 'none';
    };
};
export default loading;