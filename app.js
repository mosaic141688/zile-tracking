var express = require('express')
var app = express();
app.use(express.static('static'));

app.listen(process.env.NODE_PORT || 3000, process.env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});
