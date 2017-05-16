define([
	'jquery',
	'framework/utils/globals',
	'framework/utils/Logger'
], function($, Globals, Logger){

	function ScoreManager(p_xmlScoring) {
		Logger.logDebug('ScoreManager.CONSTRUCTOR() | ');
		/*var sType = p_sType,
			sLabel = p_sLabel;*/
	}

	ScoreManager.prototype = {
		constructor : ScoreManager,

		/*getType : function(){
			return this.sType;
		},

		getLabel : function(){
			return this.sLabel;
		},*/

		toString : function(){
			return 'framework/simulation/model/ScoreManager';
		}
	};

	return ScoreManager;
});