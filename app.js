var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static('static'));

var routes = [];

io.on("connection",function(socket){
  console.log("Device Connected");
})

http.listen(process.env.NODE_PORT || 3000, process.env.NODE_IP || 'localhost',function () {
  console.log(`Application worker ${process.pid} started...`);
});
