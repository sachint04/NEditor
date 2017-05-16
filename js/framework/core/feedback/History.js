/*
 * 	History		: [{
 * 					question					: "",
 * 					option						: "",
 * 					immediateFbTitle			: "",
 * 					immediateFbContent			: "",
 * 					optionalData	: {}
 * 				  }]
 */
define([
	'framework/utils/Logger'
], function(Logger){
	function History(p_sQuestionText, p_sOptionText, p_sImmediateFbTitleText, p_sImmediateFbContentText, p_oOptionalData){
		//Logger.logDebug('History.CONSTRUCTOR()');
		this.sQuestionText				= p_sQuestionText || '';
		this.sOptionText				= p_sOptionText || '';
		this.sImmediateFbTitleText		= p_sImmediateFbTitleText || '';
		this.sImmediateFbContentText	= p_sImmediateFbContentText || '';
		this.oOptionalData				= p_oOptionalData || {};
	}

	History.prototype.constructor							= History;



	History.prototype.setQuestionText						= function(p_sQuestionText){
		//Logger.logDebug('History.setQuestionText() | ');
		this.sQuestionText 			= p_sQuestionText;
	};
	History.prototype.setOptionText							= function(p_sOptionText){
		//Logger.logDebug('History.setOptionText() | ');
		this.sOptionText 			= p_sOptionText;
	};
	History.prototype.setImmediateFeedbackTitleText			= function(p_sImmediateFbTitleText){
		//Logger.logDebug('History.setImmediateFeedbackTitleText() | ');
		this.sImmediateFbTitleText 	= p_sImmediateFbTitleText;
	};
	History.prototype.setImmediateFeedbackContentText		= function(p_sImmediateFbContentText){
		//Logger.logDebug('History.setImmediateFeedbackContentText() | ');
		this.sImmediateFbContentText = p_sImmediateFbContentText;
	};
	History.prototype.setOptionalData						= function(p_oOptionalData){
		//Logger.logDebug('History.setOptionalData() | ');
		this.oOptionalData 			= p_oOptionalData;
	};

	History.prototype.getQuestionText						= function(){
		return this.sQuestionText;
	};
	History.prototype.getOptionText							= function(){
		return this.sOptionText;
	};
	History.prototype.getImmediateFeedbackTitleText			= function(){
		return this.sImmediateFbTitleText;
	};
	History.prototype.getImmediateFeedbackContentText		= function(){
		return this.sImmediateFbContentText;
	};
	History.prototype.getOptionalData						= function(){
		return this.oOptionalData;
	};
	History.prototype.getID									= function(){
		return this.oOptionalData.id;
	};
	History.prototype.reset									= function(){
		this.sQuestionText				= '';
		this.sOptionText				= '';
		this.sImmediateFbTitleText		= '';
		this.sImmediateFbContentText	= '';
		this.oOptionalData = {};
	};

	History.prototype.updateOptionalData					= function(p_sKey, p_value){
		//Logger.logDebug('History.updateOptionalData() | ');
		this.oOptionalData[p_sKey] = p_value;
	};

	History.prototype.destroy								= function(){
		//Logger.logDebug('History.destroy() | ');
		this.sQuestionText				= null;
		this.sOptionText				= null;
		this.sImmediateFbTitleText		= null;
		this.sImmediateFbContentText	= null;
		this.oOptionalData				= null;
	};

	return History;
});
