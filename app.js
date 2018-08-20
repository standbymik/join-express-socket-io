const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
server.listen(3000);

var clients = {};

app.set('view engine','ejs')


app.get('/',(req,res)=>{
  res.render('index')
})

io.sockets.on('connection', function (socket) {
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




