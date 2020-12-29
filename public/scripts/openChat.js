const openChat = function() {
    var iconChat = document.querySelector('.contact__social--chat');
    var chat = document.querySelector('.chat');
    var iconClose = document.querySelector('.chat .close');
    iconChat.addEventListener('click', (e)=> {
        e.preventDefault();
        chat.style.display = 'block';
    });
    iconClose.addEventListener('click', (e)=> {
        chat.style.display = 'none';
    });
};
export default openChat;