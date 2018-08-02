var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(3000);

var clients = {};

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function(socket){
  socket.on('subscribe', function(room) { 
      console.log('joining room', room);
      socket.join(room); 
  })

  socket.on('unsubscribe', function(room) {  
      console.log('leaving room', room);
      socket.leave(room); 
  })

  socket.on('send', function(data) {
      console.log('sending message');
      io.sockets.in(data.room).emit('message', data);
  });
});



