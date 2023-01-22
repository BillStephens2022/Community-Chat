var socket = io();

console.log("cahtroom.js")
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  console.log(e);
  console.log('submit');
  if (input.value) {
    console.log('pre emit');
    socket.emit('chat', input.value);
    console.log('emit');
    input.value = '';
    console.log('clear input');
  }
});

socket.on('chat', function(msg) {
  console.log('on chat massage', msg);
  var item = document.createElement('li');
  console.log('create li');
  item.textContent = msg;
  console.log('set text content');
  messages.appendChild(item);
  console.log('append child');
  window.scrollTo(0, document.body.scrollHeight);
});