var express = require('./server/node_modules/express');
var fs 		= require('fs');
var path    = require("path");
var bodyParser 	= require('./server/node_modules/body-parser');

var xmlutils = require(__dirname+ '/server/xmlutils');


var app 	= express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static('./'));

app.get('/', function (req, res) {
	res.sendFile('editor.html');
	console.log('editor launched.');
});

app.get('/data', function (req, res) {
	xmlutils.loadFile(__dirname+ '/xml/pg01.xml', function(result){
		res.sendSta(result);
	}, this);  
});
app.post('/postdata', function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	console.log("postdata received "+req.body.data); 
	res.send({"status":200});
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at ', host, port);
});

