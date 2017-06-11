var express 	= require('express');
var fs 			= require('fs');
var path 		= require('path');
var bodyParser 	= require('body-parser');


var xmlutils = require(__dirname+ '/xmlutils');


var app 	= express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());


app.post('/', function(req,res){
   console.log("postdata received "+ req.body);

});
app.get('/data', function (req, res) {
	xmlutils.loadFile(__dirname+ '/xml/pg01.xml', function(result){
		res.send(result);
	}, this);  
});
app.post('/postdata', function(req, res){
	console.log("postdata received "+ req.body);
})
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening  '+ host);
});