
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));

var db = require('./db');
app.use(express.static('ui'));

var routes = [];

io.on("connection",function(socket){
  console.log("Device Connected");
  socket.on("coords",function(cd){
    db.updateDevice(cd,(es)=>console.log(es));
    db.deviceRegistered(cd,(reg)=>socket.emit("registered",reg));
  });
  socket.on("signup",(_school)=>{
    db.registerSchool(_school,(res)=>{
      socket.emit("signed",res);
    });
  });

  socket.on("get-device",(_dev_id)=>{
    db.getDevice(_dev_id,(res)=>{
      socket.emit("got-device",res);
    })
  })


  socket.on("get-school",(_school_id)=>{
    console.log(_school_id);
  });

  socket.on("reg-device",(params)=>{
    console.log(JSON.stringify(params));
    db.registerDevice(params.dev,params.school._id,(res)=>console.log(res))
  })
})

app.get("/alldevices",(req,res)=>db.allDevices((dat)=>res.send(dat)));


app.post("/devices",(req,res)=>{
  console.log(req.body);

});

app.post("/school",(req,resp)=>db.getSchools({_id:db._ID(req.body._id)},(res)=>resp.send(res)));
app.post("/reportlost",(req,resp)=>db.setLost(req.body.dev_id,(res)=>resp.send(res)));
app.post("/recover",(req,resp)=>db.recover(req.body.dev_id,(res)=>resp.send(res)));
app.post("/signup",(req,resp)=>db.registerSchool(_school,(res)=>resp.send(res)));
app.post("/device",(req,resp)=>db.getDevice(req.body.dev_id,(res)=>resp.send(res)));
app.post("/regdevice",(req,resp)=>db.registerDevice(req.body.dev_id,req.body.school_id,(res)=>resp.send(res)));
//app.post("/lostDevices",(req,resp)=>db.)
app.post("/locs",function(req,res) {
  db.getLocations((dat)=>res.send(dat));
})

app.get("/locs",function(req,res) {
  db.getAllLocations((dat)=>res.send(dat));
})

http.listen(process.env.NODE_PORT || 3000, process.env.NODE_IP || "0.0.0.0",function () {
  console.log(`Application worker ${process.pid} started...`);
});
