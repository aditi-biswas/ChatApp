// Node server which will handle socket.io connections

const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
    //   methods: ["GET", "POST"]
    }
  }); // we can take any port like 8000
// we want to use socket on 8000 port
/* Now we are running a socket.io server which is an instance of http, i.e., it
   attaches itself with an http instance*/
/* socket.io server will listen incoming events*/

/* io.on is a socket.io instance which listens many socket connections for different
 people connecting the socket*/ 
 /* socket.on handles what needs to be done with a particular connection when 
 something happens with that particular connection */

const user={};     // for all connected users

io.on('connection', socket=>{      // whenever connection comes in this socket perform the functionality in the {} brackets
    //Whenever any new user jois, let other users connected to the server know
    socket.on('new-user-joined',name=>{  // whwnever a user is joining what should happen
        // console.log("new user ",name);
        user[socket.id] = name; //give each connection a unique id which is unique and automatically given by socket
        // user object(dictionary) ko ek key de do which is called socket.id and assign it the user name but value of socket.id is not name..by this syntax we are assigning that user object to that socket.id and by user[socket.id] we will access their names
        
        socket.broadcast.emit('user-joined',name);
        //emits msg to everyone except the user who joined(i.e., who initiated the event as a result of which broadcast is happening)
    });  // 'user joined' can be any name not specifically user-joined

    // If someone sends a message, broadcast it to all other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: user[socket.id]}) //we are passing an event to everyone to receive the sent msg-- we can give any name of events according to our choice i.e., custom name
    });

    // If someone leaves the chat, let others know
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', user[socket.id]);
        delete user[socket.id];
    })

});

// socket.on accepts an event which here is user-joined