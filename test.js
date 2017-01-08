var db = require('./db');

var device = {
  lat:-23.0876,
  lng:22.8634,
  device:"76543554747"
}

//db.updateDevice(device);
db.allDevices((data)=>console.log(JSON.stringify(data)))
