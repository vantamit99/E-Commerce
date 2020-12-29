const loading = function() {
    var wrapper = document.querySelector('.wrapper');
    var loading = document.querySelector('.loading');
    var social = document.querySelector('.effect__social');

    window.onload = function() {
        wrapper.style.display = 'block';
        social.style.display = 'block';
        loading.style.display = 'none';
    };
};
export default loading;