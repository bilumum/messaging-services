var express = require("express");
var cors = require('cors');
//var io = require('socket.io');

var userSockets = {};
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

    userSockets[connectedUser.userId] = socket;
    
    socket.broadcast.emit("NEW_JOIN", connectedUser.name + ' ' + connectedUser.surname + " joined");
   
    socket.on('disconnect', () => {

      delete userSockets[connectedUser.userId];      
      logoutUser(connectedUser);
      
      socket.broadcast.emit("NEW_JOIN", connectedUser.name + ' ' + connectedUser.surname + " left");
      console.log(connectedUser.name + ' ' + connectedUser.surname + " disconnected");
    });

    socket.on("PRIVATE_MESSAGE", (data) => {
      const to = data.to,
            message = data.message;

      if(userSockets[to]){
        userSockets[to].emit("PRIVATE_MESSAGE", {
          userId: connectedUser.userId,
          message: message
        });
      }
    });
  }
});