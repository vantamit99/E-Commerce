const chatSocket = function () {
    var socket = io();
    var send = document.querySelector('.send__message');
    var content = document.querySelector('.value__message');
    var listContent = document.querySelector('.content__message--details');
    var form = document.querySelector('.formChat');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
    });

    send.addEventListener('click', sendAdmin);

    content.addEventListener('keypress', (e) => {
        if (e.keyCode == 13) {
            sendAdmin();
        }
    })

    function sendAdmin() {
        let valueMessage = content.value;
        content.value = "";

        socket.emit('sendToAdmin', valueMessage);
    }

    socket.on('sendToClient', (msg) => {
        listContent.innerHTML += "<div>" + msg + "</div>";
    });
};
export default chatSocket;