var xmlutils = {
	xmltojs :function(xmlString){
		var x2js = new X2JS();
		return  x2js.xml2js(xml);
	},
	jstoxml :function(json){
		return x2js.js2xml(json);
	}
}


var XMLWriter = require('xml-writer');
    xw = new XMLWriter;
    xw.startDocument();
    xw.startElement('root');
    xw.writeAttribute('foo', 'value');
    xw.text('Some content');
    xw.endDocument();