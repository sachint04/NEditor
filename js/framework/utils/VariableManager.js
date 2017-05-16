/**
 * 
 * @module framework.utils.VariableManager
 */
define([
	'x2js',
	'framework/utils/EventDispatcher',
	'framework/utils/Logger'
], function(X2JS, EventDispatcher, Logger){
	var __instanceVariableManager;

	/** 
	 * @construtor 
	 * @alias  framework.utils.VariableManager
	 */
	function VariableManager(){
		//Logger.logDebug('VariableManager.CONSTRUCTOR() | ');
		EventDispatcher.call(this);
		this.oDataStore;
		this.oPersistentDataStore;
		this.oCourseConfigModelReference;
		/*
		 var oX2JS = new X2JS();
		this.oDataModel = oX2JS.xml2json(p_xml);
		 */
		this.init();
	}

	VariableManager.prototype								= Object.create(EventDispatcher.prototype);
	VariableManager.prototype.constructor					= VariableManager;

	VariableManager.prototype.init			= function(){
		this.oDataStore						= {};
		this.oPersistentDataStore			= {};
		this.getCourseConfigModel();
	};

	VariableManager.prototype.getCourseConfigModel				= function(){
		var oScope = this;
		require(['framework/model/CourseConfigModel'], function(CourseConfigModel){
			oScope.setCourseConfigModel(CourseConfigModel);
		});

		return this.oCourseConfigModelReference;
	};

	VariableManager.prototype.setCourseConfigModel				= function(p_oModel){
			this.oCourseConfigModelReference = p_oModel;
	Logger.logDebug(this.toString()+' setCourseConfigModel   this.oCourseConfigModelReference  - '+ this.oCourseConfigModelReference );
	};

	/**
	 *  parse 'global_variable.xml' and store items in memory for global access .
	 */
	// VariableManager.prototype.setGlobalVariables					= function(p_xml){
		// var oX2JS 			= new X2JS(),
		// oGlobalVars 			= oX2JS.xml2json(p_xml),
		// aItems 				= oGlobalVars.global.item;
		// sGlobalVariablePattern  	= oGlobalVars.global._regExpPattern;
		// for(var i =0; i < aItems.length;i++){
			// var oItem  		= aItems[i];
			// this.setVariable('gbl_'+oItem._id, oItem.__cdata);
		// }
	// }

	/**
	 * Function: replaceGlobalVariables
	 * replace all insatance of variables with text/Value in 'global_variable.xml'
 	* @param {Object} p_str -
	 */
	VariableManager.prototype.resolveVariables				= function(p_str){
		//this.getCourseConfigModel();
		var sGlobalVariablePattern 		= this.oCourseConfigModelReference.getConfig("text_filter_regexp_pattern").value;
		try{
			var sValue = p_str,
			regExp = new RegExp(sGlobalVariablePattern, "g"),
			aMatch = sValue.match(regExp);
			if(aMatch){
				for(var i=0;i < aMatch.length;i++){
					var sTarget 	= aMatch[i],
					sVar 			= sTarget.replace(new RegExp(sGlobalVariablePattern.split(".+?")[0],"g"), ""),
					sReplaceWith 	= this.getVariable(sVar);
					sValue 			= sValue.replace(sTarget, sReplaceWith);
				}

				p_str = sValue;
			}
		}catch(e){
			Logger.logWarn('WARNING : VariableManager : replaceGlobalVariables() ERROR while replaceing global paramenters');
		}
		return p_str;
	};

	VariableManager.prototype.setVariable					= function(p_sKey, p_value, p_bPersistent){
		//Logger.logDebug('VariableManager.setVariable() | Prperty = '+p_sKey+' : Value = '+p_value);
		if(!(typeof p_sKey === 'string')){
			Logger.logError('VariableManager.setVariable() | ERROR: Invalid Parameter. "Key" needs to be a String');
		}
		if(p_bPersistent && this.oDataStore[p_sKey]){
			Logger.logError('VariableManager.setVariable() | ERROR: Invalid Parameter. "Key" aleready exists in non-persistent data store');
		}
		if(!p_bPersistent && this.oPersistentDataStore[p_sKey]){
			Logger.logError('VariableManager.setVariable() | ERROR: Invalid Parameter. "Key" aleready exists in persistent data store');
		}
		if(this.oDataStore[p_sKey]){
			Logger.logWarn('VariableManager.setVariable() | Overwriting value of "'+p_sKey+'"');
		}

		if(p_bPersistent){
			this.oPersistentDataStore[p_sKey] = p_value;
			return this.oPersistentDataStore[p_sKey];
		}else{
			this.oDataStore[p_sKey] = p_value;
			return this.oDataStore[p_sKey];
		}
		return null;
	};

	VariableManager.prototype.getVariable					= function(p_sKey){
		//Logger.logDebug('VariableManager.getVariable() | Prperty = '+p_sKey);
		var value	= this.getValues(p_sKey, this.oDataStore); /* look for value in session data store */
		if(!value){
			value 	= this.getValues(p_sKey, this.oPersistentDataStore); /* look for value in persistent data store*/
			if(!value){
				value = this.getValueFromConfig(p_sKey);/* check value in course_config.xml*/
				if(!value){
					Logger.logWarn('VariableManager.getVariable() | WARN: Key named "'+p_sKey+'" not found.');
					return false;
				}
			}
		}
		return value;
	};

	VariableManager.prototype.getValueFromConfig			= function(p_sKey){
		var aKeys =	p_sKey.split("."),
			oResult,
			result,
			sKey;

		try{
			oResult = this.oCourseConfigModelReference.getConfig(aKeys[0]);
			aKeys.shift();
			sKey = aKeys.join('.');
			result = this.getValues(sKey, oResult);

			return result;
		}catch(e){
			return null;
		}
		return null;
	}

	VariableManager.prototype.getValues						= function(p_sKey, p_oData){
		var aKeys =	p_sKey.split("."),
			i,
			result = p_oData;

		for(i =0;  i < aKeys.length;i++){
			if(result[aKeys[i]] === undefined){
				return null;
			}
			result 	= result[aKeys[i]];
		}

		return result;
	}

	VariableManager.prototype.setBookmark					= function(p_sBookmark){
		this.oPersistentDataStore = JSON.parse(p_sBookmark);
	};

	VariableManager.prototype.getBookmark					= function(){
		return JSON.stringify(this.oPersistentDataStore);
	};

	VariableManager.prototype.toString						= function(){
		return 'framework/core/VariableManager';
	};

	if(!__instanceVariableManager){
		__instanceVariableManager = new VariableManager();
		//Logger.logDebug('^^^^^^^^^^^^ VARIABLE MANAGER INSTANCE ^^^^^^^^^^^^^^ '+__instanceVariableManager);
	}

	return __instanceVariableManager;
});
