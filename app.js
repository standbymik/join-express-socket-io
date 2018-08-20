const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
var session = require("express-session")({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true
});
var sharedsession = require("express-socket.io-session");

server.listen(3000);

app.use(session);

// Use shared session middleware for socket.io
// setting autoSave:true
io.use(sharedsession(session));

var clients = {};

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  if(!req.session.user)
    res.send('Please login')
  res.render('index',{user:req.session.user})
})

io.use(sharedsession(session, {
  autoSave: true
}));

io.sockets.on('connection', function (socket) {
  socket.on("login", function (userdata) {
    socket.handshake.session.userdata = userdata;
    socket.handshake.session.save();
  });
  socket.on("logout", function (userdata) {
    if (socket.handshake.session.userdata) {
      delete socket.handshake.session.userdata;
      socket.handshake.session.save();
    }
  });

  socket.on('subscribe', function (room) {
    console.log('joining room', room);
    socket.join(room);
  })

  socket.on('unsubscribe', function (room) {
    console.log('leaving room', room);
    socket.leave(room);
  })

  socket.on('send', function (data) {
    console.log('sending message');
    io.sockets.in(data.room).emit('message', data);
  });
});




