define([
	'jquery',
	'framework/utils/globals',
	'framework/utils/Logger'
], function($, Globals, Logger){

	function DecisionMappingModel(p_sType, p_sLabel) {
		Logger.logDebug('DecisionMappingModel.CONSTRUCTOR() | Type = '+p_sType+' : Label = '+p_sLabel);
		this.sType = p_sType;
		this.sLabel = p_sLabel;
	}

	DecisionMappingModel.prototype = {
		constructor : DecisionMappingModel,

		getType : function(){
			return this.sType;
		},

		getLabel : function(){
			return this.sLabel;
		},

		toString : function(){
			return 'framework/simulation/model/DecisionMappingModel';
		}
	};

	return DecisionMappingModel;
});