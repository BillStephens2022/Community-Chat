var socket = io();

console.log("chatroom.js")
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  console.log('submit');
  if (input.value) {
    socket.emit('chat', input.value);
    console.log('emit user input chat:', input.value);
    input.value = '';
    console.log('clear input');
  }
});

socket.on('chat', function(msg) {
  console.log('recieved chat message from server:', msg);
  var item = document.createElement('li');
  item.textContent = `${user.username}: ${msg}`;
  console.log('appied text content to list item');
  messages.appendChild(item);
  console.log('append list item to messages list');
  window.scrollTo(0, document.body.scrollHeight);
});