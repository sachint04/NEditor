var fs = require("fs")

module.exports = function(){
	this.saveXML =  function(data, path, callback, scope){
		fs.writeFile(path, data, function (err, file) {
		  if (err) throw err;
		  //console.log('Saved!');
		  callback.apply(scope, ['200']);
		});
	};
}

