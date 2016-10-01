
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
exports._ID = mongoose.Types.ObjectId;
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

var SchoolSchema = new mongoose.Schema({
   name:String,
   email:String,
   address:String,
   tel:String,
   province:String,
   password:String,
   devices:[{type:String,ref:"device"}]
})



var DeviceSchema = mongoose.Schema({
  _id:String,
  status:{type:String,default:"offline"},
  lost:{type:Boolean,default:false},
  registered:{type:Boolean, default:false},
  location:{lat:Number,lng:Number},
  trail:[{lat:Number,lng:Number,time:{type:Date,default:Date.now()}}]
});



var Device = mongoose.model("device",DeviceSchema);

var School = mongoose.model("school",SchoolSchema);
exports.setDeviceOnline=function(dev_id,callback){
  Device.update({_id:dev_id},{status:"online"},(err,res)=>err?console.log(err):callback(res));
}
exports.setDeviceOffline = function(dev_id,callback){
  Device.update({_id:dev_id},{status:"offline"},(err,res)=>err?console.log(err):callback(res))
}

exports.deviceRegistered = function(dev,callback){
  Device.findOne({_id:dev},(err,res)=>err?console.log(err):callback(res));
}

var registerDevice = function(dev,sch,callback){
  Device.findOne({_id:dev},(err,res)=>{
    if(err){
      console.log(err);
    }
else if (res) {
  if(res.registered){
    callback("1111");
    return;
  }
  School.update({_id:mongoose.Types.ObjectId(sch)},{$push:{devices:dev}},(er,re)=>er?console.log(er):callback(re));
  res.registered=true;
  res.save();
}
else{
  callback("0000");
}
  })
}

exports.registerDevice=registerDevice;

var getSchool = function(sch, callback){
  School.findOne({_id:sch}).populate("devices").exec((err,res)=>err?console.log(err):callback(res));
}

var registerSchool=function(sch,callback){
  School.findOne({email:sch.email},function(err,res){
    if(err){
      console.log(err);
    }
    else {
      if (res) {
        callback(res)
      }
      else{
        School.create(sch,(er,re)=>er?console.log(er):callback(re));
      }
    }
  })
}

exports.registerSchool = registerSchool;

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

exports.getDevice = function(_dev_id,callback){
    Device.find({_id:_dev_id},(err,res)=>err?console.log(err):callback(res));
}

exports.removeDevice=function(_dev_id,_sch,callback){
  School.update({_id:mongoose.Types.ObjectId(_sch)},{$pull:{devices:_dev_id}},(err,res)=>err?console.log(err):callback(res));
  Device.update({_id:_dev_id},{registered:false});
}

exports.resetRegistration=function (_dev_id,callback) {
    Device.update({_id:_dev_id},{registered:false},(err,res)=>err?console.log(err):callback(res));
}

exports.setLost=function(_dev_id,callback){
  Device.update({_id:_dev_id},{lost:true},(err,res)=>err?console.log(err):callback(res));
}

exports.recover = function(_dev_id,callback){
  Device.update({_id:_dev_id},{lost:false},(err,res)=>err?console.log(err):callback(res));
}

var getAllLocations = function(callback){
  Location.find({},(err,res)=>err?console.log(err):callback(res));
}
exports.getSchools=function(query,callack){
  School.find(query).populate('devices').exec((err,res)=>err?console.log(err):callack(res));
}
exports.getAllLocations=getAllLocations;
exports.getLocations=getLocations;
