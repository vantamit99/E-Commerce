const openModal = function() {
    const add = function() {
        var open = document.querySelector('.open__modal--add');
        var close = document.querySelector('.btn__cancel');
        var formAdd = document.querySelector('.form__add');

        open.addEventListener('click', e => {
            formAdd.style.display = 'block';
        });
        close.addEventListener('click', e => {
            e.preventDefault();
            formAdd.style.display = 'none';
        });
    };
    add();
}();
