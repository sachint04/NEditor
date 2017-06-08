var utils = {
	xmltojs :function(xmlString){
		var x2js = new X2JS();
		return  x2js.xml2js(xml);
	},
	jstoxml :function(json){
		var x2js = new X2JS();
		return x2js.js2xml(json);
	}
}