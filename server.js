var express = require('./server/node_modules/express');
var fs 		= require('fs');
var path    = require("path");

var xmlutils = require(__dirname+ '/server/xmlutils');


var app 	= express();

app.use(express.static('./'));

app.get('/', function (req, res) {
	res.sendFile('editor.html');
	console.log('editor launched.');
});

app.get('/data', function (req, res) {
	xmlutils.loadFile(__dirname+ '/xml/pg01.xml', function(result){
		res.send(result);
	}, this);  
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

