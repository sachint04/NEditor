define([
	'framework/core/score/Score',
	'framework/utils/Logger'
], function(Score, Logger){
	function SIMScore(p_qstnID){
		//Logger.logDebug('SIMScore.CONSTRUCTOR() ');
		Score.call(this, p_qstnID);
		return this;
	}

	SIMScore.prototype 									= Object.create(Score.prototype);
	SIMScore.prototype.constructor						= SIMScore;

	return SIMScore;
});