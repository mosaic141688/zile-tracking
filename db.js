var mongoose = require('mongoose');
var url="mongodb://localhost/zile:27017";
// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
   url = process.env.OPENSHIFT_MONGODB_DB_URL +
       process.env.OPENSHIFT_APP_NAME;
}

// Connect to mongodb
var connect = function () {
   mongoose.connect(url);
};
connect();

var db = mongoose.connection;

db.on('error', function(error){
   console.log("Error loading the db - "+ error);
});

db.on('disconnected', connect);

var LocationSchema = new mongoose.Schema({
   device:String,
   lat:Number,
   lng:Number
})

var DeviceSchema = mongoose.Schema({
  _id:String,
  location:{lat:Number,lng:Number},
  trail:[{lat:Number,lng:Number,time:{type:Date,default:Date.now()}}]
});

var Device = mongoose.model("device",DeviceSchema);

var updateDevice = function(dev,callback){
  Device.findOne({_id:dev.device},function(err,res){
    if(err)
    console.log(err);
    else {
      if(res){
        console.log("Device Exists");
        Device.update({_id:dev.device},{'location.lat':dev.lat,'location.lng':dev.lng,$push:{trail:{lat:dev.lat,lng:dev.lng}}},(er,re)=>er?console.log(er):console.log(re));
      }
      else{
        Device.create({_id:dev.device,location:{lat:dev.lat,lng:dev.lng}});
      }
    }
  })
}

var allDevices=function(callback){
  Device.find({},(err,res)=>err?console.log(err):callback(res));
}

exports.allDevices=allDevices;

exports.updateDevice=updateDevice;
var Location = mongoose.model("user",LocationSchema);
var save=function(loc,callback){
  Location.create(loc,(err,res)=>err?console.log(err):callback(res));
}
exports.save=save;
var getDevices=function(callback){
  Location.aggregate([
        {
            $group: {
                _id: '$device',  //$region is the column name in collection
                count: {$sum: 1}
            }
        }
    ], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });
}
exports.getDevices=getDevices;
var getLocations = function(callback){
  Location.find({},'lat lng',(err,res)=>err?console.log(err):callback(res));
}

var getAllLocations = function(callback){
  Location.find({},(err,res)=>err?console.log(err):callback(res));
}
exports.getAllLocations=getAllLocations;
exports.getLocations=getLocations;
