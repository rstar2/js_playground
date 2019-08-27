let ws = new WebSocket('ws://' + window.document.
    location.host);
ws.onmessage = function(message) {
    let msgDiv = document.createElement('div');
    msgDiv.innerHTML = message.data;
    document.getElementById('messages').appendChild(msgDiv);
};
function sendMessage() {
    let message = document.getElementById('msgBox').value;
    ws.send(message);
}