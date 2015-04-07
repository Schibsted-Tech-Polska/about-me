var express = require('express');
var about = require('../lib/about.js');
var app = express();

app.get('/', about());

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('About-me app listening at http://%s:%s', host, port);

});