var express = require('express')
var app = express();
app.use(express.static('public'));
app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});
