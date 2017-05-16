var fs = require('fs');
var xml2js 	= require('xml2js');

var parser	= new xml2js.Parser();

var loadFile = function(p_sPath, p_fCallback, p_scope){
		console.log('p_sPath - '+p_sPath);	var callback = p_fCallback,
	scope		= p_scope;
	fs.readFile(p_sPath, function(err, data){
		parser.parseString(data, function(err, 	result){
			//console.log(JSON.stringify(result));
			callback.apply(scope, [result]);
		});
	});
};



module.exports = {
	'loadFile' : loadFile	
};