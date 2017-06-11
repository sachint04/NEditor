var express = require('./server/node_modules/express');
var path    = require("path");
var bodyParser 	= require('./server/node_modules/body-parser');

var IO 			= require(__dirname+ '/server/IO');
var xmlutils = require(__dirname+ '/server/xmlutils');


var app 	= express();

var io = new IO();

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
	//console.log("postdata received "+req.body.data+"\n - Location - "+ req.body.path); 
	var path =	__dirname+'\\'+req.body.path;
	io.saveXML(req.body.data, path, function(status){
		console.log("file IO returned with "+ status)
		res.send({"status":200});		
	});
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at ', host, port);
});


