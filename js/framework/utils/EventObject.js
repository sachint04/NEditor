	'use strict';
	/**
	 * 
	 * 
	 * @module framework.utils.EventObject
	 *  
	 */
define([
	'framework/utils/Logger'
], function(Logger){
	/** 
	 *@constructor
	 * @alias  framework.utils.EventObject
 * @param {Object} p_sType
 * @param {Object} p_oTarget
 * @param {Object} p_oCurrentTarget
 * @param {Object} p_oData
	 */
	function EventObject(p_sType,p_oTarget,p_oCurrentTarget,p_oData){
		//EventDispatcher.call(this);
		this.stype				= p_sType;
		this.oTarget			= p_oTarget;
		this.oCurrentTarget 	= p_oCurrentTarget;
		this.oData				= p_oData;
		this.bDefaultPrevented	= false;
		return this;
	}

	//EventObject.prototype								= Object.create(EventDispatcher.prototype);
	//EventObject.prototype.constructor					= EventObject;
	/**
	 *  
 	* @param {Object} p_bFlag
	*/
	EventObject.prototype.defaultPrevented				= function(p_bFlag){
		if(p_bFlag === null){return this.bDefaultPrevented;}
		this.bDefaultPrevented = p_bFlag;
	};
	
	return EventObject;
});