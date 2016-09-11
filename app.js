var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var db = require('./db');
app.use(express.static('static'));

var routes = [];

io.on("connection",function(socket){
  console.log("Device Connected");
  socket.on("coords",function(cd){
    db.save(cd,(es)=>console.log(es));
  });
})

app.post("/locs",function(req,res) {
  db.getLocations((dat)=>res.send(dat));
})

http.listen(process.env.NODE_PORT || 3000, process.env.NODE_IP || 'localhost',function () {
  console.log(`Application worker ${process.pid} started...`);
});
