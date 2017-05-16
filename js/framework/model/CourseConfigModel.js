	'use strict';
	/**
	 * CourseConfigModel Module is Model of course.xml
	 * 
	 * @exports framework/model/CourseConfigModel
	 *
	 *  
	 */
define([
	'jquery',
	'xml2json',
	'x2js',
	'framework/utils/EventDispatcher',
	'framework/utils/ResourceLoader',
	'framework/utils/Logger'
], function($, xml2json, X2JS, EventDispatcher, ResourceLoader, Logger){
	var jSonObject,
		oConfig = {},
		sSelectedLanguage,
		sDefaultLanguage = "en";

	/*var __instanceCourseConfigModel;

	function CourseConfigModel(){
		//Logger.logDebug('CourseConfigModel.CONSTRUCTOR() | ');
		EventDispatcher.call(this);
	}

	CourseConfigModel.prototype								= Object.create(EventDispatcher.prototype);
	CourseConfigModel.prototype.constructor					= CourseConfigModel;*/

	/* -----------------------------------------*/
	/* 				 Public Methods 			*/
	/* -----------------------------------------*/
	var load = function(p_configXMLURL){
		//Logger.logDebug('CourseConfigModel.load() | '+p_configXMLURL);
		var oResLoader1 = new ResourceLoader();
		oResLoader1.loadResource(p_configXMLURL, this, parseConfig);
	};

	var getConfig = function(p_key){
		//Logger.logDebug('CourseConfigModel.getConfig() | '+p_key);
		if(oConfig[p_key]){
			return oConfig[p_key];
		}
		Logger.logError('Property named "'+p_key+'" not found in Config XML file.');
	};

	var getRootPath = function(){
		//Logger.logDebug('CourseConfigModel.getRootPath() | ');
		sSelectedLanguage = (sSelectedLanguage) ? sSelectedLanguage : sDefaultLanguage;
		return getConfig('content_path').label + '/' + sSelectedLanguage + '/';
		//return getConfig('content_path').label + '/' + getConfig('langauge').suffix  + '/';
	};

	var getSelectedLanguage = function(){
		return sSelectedLanguage;
	};
	var setSelectedLanguage = function(p_sSelectedLanguage){
		var language = getConfig('language');
		if(language instanceof Array){
			for(var i=0; i<language.length; i++){
				if(language[i].suffix === p_sSelectedLanguage){
					sSelectedLanguage = p_sSelectedLanguage;
					return;
				}
			}
		}else{
			if(language.suffix == p_sSelectedLanguage){
					sSelectedLanguage = p_sSelectedLanguage;
					return;
			}
		}
		Logger.logError('CourseConfigModel.setSelectedLanguage() | Invalid Parameter "'+p_sSelectedLanguage+'". The parameter needs to match one of the "language suffix" specified in the Course Config XML.');
	};

	/* -----------------------------------------*/
	/* 				 Private Methods 			*/
	/* -----------------------------------------*/
	var parseConfig = function(p_oContext, p_xml, p_oResourceLoader){
		//Logger.logDebug('CourseConfigModel.parseConfig() | '+(p_oResourceLoader instanceof ResourceLoader)/*+' : '+p_oResourceLoader.getName()*/);
		p_oResourceLoader.destroy();
		/*var oX2JS = new X2JS(),
			oDataModel = oX2JS.xml2json(p_xml[0]);
		//console.log('CourseConfigModel.parseConfig() | '+JSON.stringify(oDataModel));*/
		jSonObject = $.xml2json(p_xml[0]);
		//Logger.logDebug('CourseConfigModel.parseConfig() | '/*+JSON.stringify(jSonObject)*/);
		var i;
		for(i=0; i<jSonObject.item.length; i++){
			var key = jSonObject.item[i].name;
			//Logger.logDebug('CourseConfigModel.getConfig() | key = '+key+' : Value = '+jSonObject.item[i]+' : '+oConfig[key]+' : IS Array = '+(oConfig[key] instanceof Array));
			if(!oConfig[key] && !(oConfig[key] instanceof Array)){
				oConfig[key] = jSonObject.item[i];
			}else if(oConfig[key] instanceof Array){
				oConfig[key].push(jSonObject.item[i]);
			}else{
				// ** Key already exists, so create an array instead
				var temp = oConfig[key];
				oConfig[key] = [];
				oConfig[key].push(temp, jSonObject.item[i]);
			}
		}

		$.publish('COURSE_CONFIG_LOADED');
	};

	var toString = function(){
		return 'framework/model/CourseConfigModel';
	};
	
	/**
 	 * <b>CourseConfigModel</b> .
     * @alias module:framework/model/CourseConfigModel
     */
	return {
		load : load,
		getConfig : getConfig,
		getRootPath : getRootPath,
		getSelectedLanguage : getSelectedLanguage,
		setSelectedLanguage : setSelectedLanguage,
		toString : toString
	};

	/*if(!__instanceCourseConfigModel){
		__instanceCourseConfigModel = new CourseConfigModel();
		//console.log('^^^^^^^^^^^^ UI MANAGER INSTANCE ^^^^^^^^^^^^^^ '+__instanceCourseConfigModel);
	}

	return __instanceCourseConfigModel;*/
});