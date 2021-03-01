var express = require("express");
var cors = require('cors');
//var io = require('socket.io');

//var onlineUsers = [];
const onlineUsersRoute = require('./routes/onlineUsers').router;
var logoutUser = require('./routes/onlineUsers').logoutUser ;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", onlineUsersRoute);

app.use("/", function(req, res){
    return res.send("node api is working...");
});

var server = app.listen(8080, () => {
    console.log("Server running on port 8080");
});

//io.listen(server);
var io = require('socket.io')(server,{
  cors: {
    origin: '*',
  }
});

io.sockets.on('connection', function (socket) {
  
  let connectedUser = socket.handshake.auth;

  //console.log(socket.handshake);

  if(connectedUser){
  
    console.log(connectedUser.name + ' ' + connectedUser.surname + " connected");

    socket.broadcast.emit("NEW_JOIN", connectedUser.name + ' ' + connectedUser.surname + "geldi");
   
    socket.on('disconnect', () => {

      //onlineUsers = onlineUsers.filter(user => user.userId === connectedUser.userId);
      logoutUser(connectedUser);
      //console.log(onlineUsers);

      socket.broadcast.emit("NEW_JOIN", connectedUser.name + ' ' + connectedUser.surname + "gitti");
      console.log(connectedUser.name + ' ' + connectedUser.surname + " disconnected");
    });

  }

  

});