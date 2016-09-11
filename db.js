var mongoose = require('mongoose');
var url="mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT";
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
  Location.find({},'lat,lng',(err,res)=>err?console.log(err):callback(res));
}
exports.getLocations=getLocations;
