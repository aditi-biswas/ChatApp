// We connected the client and server through the script used in html file

// Getting DOM elements in variables 
const socket = io('http://localhost:8000')

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container'); // we are selecting the element with class container as we will be working with that element so it is good if we select it beforehand
 // whenever we get any msg we will put inside the out "container" class

var audio = new Audio('move.mp3'); // audio played on receiving mgs

// function which will append event info to the container
const appendMsg = (message, position) => {
    const messageElement=document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message'); // add messgae class
    messageElement.classList.add(position);  // added the position class 
    messageContainer.append(messageElement);
    if(position=="left"){
        audio.play();
    }
}  // We could also do this using innerHTML

// If the form gets submitted, send server the event(message)
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg=messageInput.value;
    appendMsg(`You: ${msg}`,"right");
    socket.emit('send',msg);
    messageInput.value="";
})


// Ask new user for his name
const name=prompt("Enter your name to join");
socket.emit('new-user-joined',name); // same as the event name in server(index.js)
//If new user joins let the server know

// If new user joins, receive event and his/her name from server and do the necessary jobs of displaying entry msg. 
socket.on('user-joined',name=>{
    appendMsg(`${name} joined the chat`, "right");
});

// If server(user sent to server and server sent to other users) sends a msg receive it
socket.on('receive', data => {
    appendMsg(`${data.name}:${data.message}`, "left");
});

// If user leaves the chat, append info to the container
socket.on('left', name => {
    appendMsg(`${name} left the chat`, 'left');
});
