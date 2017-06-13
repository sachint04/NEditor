var serverProxy ={
	saveXML:function(data, location, callback, scope){
		var  pageText 	= data.data.pageText,
		found 			= false;
		if(!pageText.length){
			if(pageText._id == spriteid){
				pageText.__cdata = content;
				found = true;
			}
		}else{
			for (var i=0; i < pageText.length; i++) {
			  if(pageText[i]._id == spriteid){
					pageText[i].__cdata = content;
					found = true;
					break;
				}
			};
		}
		if(!found){
			data.data.pageText = (data.data.pageText.length)?data.data.pageText : [data.data.pageText];
			data.data.pageText.push({"_id":spriteid, "__cdata": content}); 				
		}
		var obj = {
			data:cleanXML(utils.jstoxml(data).toString()),
			path	: guidToPath(location, 'xml')
		}
		post(obj, 'text', callback, scope);	
	},
	saveHTML:function(data){
		
	},
	saveCSS:function(data, location, callback, scope){
		var obj = {
			data:	data,
			path: guidToPath(location, 'css')
		}
		post(obj, 'css', callback, scope);
			
	}

}

var post = function(_data, type, callback, scope){
		$.ajax({
			url			:"http://localhost:3000/postdata",
			dataType: "json",
			data		: _data,
			type		: "POST"
		}).
		done(function(msg){
				console.log("post succesfull!");
				
				callback.apply(scope, [msg]);
			}).
		fail(function(error) {
  		  alert( "error" );
 		});
	}
	
var cleanXML = function(str){
	//str = str.replace(/[/\r]+/g, '');
	//str =  str.replace(/[/\n]+/g, '');
	
	return str;
}
var guidToPath = function(guid, type){
		guid = guid.split("~").join("\\");
	var path =	"\\sco_content\\en\\"+ type+"\\"+ guid +"."+type;
	return path;
}
