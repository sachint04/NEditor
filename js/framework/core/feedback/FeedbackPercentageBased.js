define([
	'framework/core/feedback/Feedback',
	
	'framework/utils/Logger'
], function(Feedback,  Logger){
	function FeedbackPercentageBased(p_sType, p_sActivityType, p_sQuestionID){
		//Logger.logDebug('FeedbackPercentageBased.CONSTRUCTOR()');
		Feedback.call(this, p_sType, p_sActivityType, p_sQuestionID);
		
	};

	FeedbackPercentageBased.prototype											= Object.create(Feedback.prototype);
	FeedbackPercentageBased.prototype.constructor								= FeedbackPercentageBased;

	// ** Overiding the Super Class Method for custom implementation. This gets called from the the "getFeedback()" method in the "ComponentModelAbstract" Class  
	FeedbackPercentageBased.prototype.processFeedback							= function(p_x2jsFeedback, p_oScore){
		var nPercentageScore = p_oScore.getPercentScore(),
			aRange			 = p_x2jsFeedback.range,
			aRangeCount		 = aRange.length;
			
		
		for(var i=0; i<=aRangeCount;i++){
			if(this._isPercentScoreInRange(nPercentageScore,aRange[i]._scoreRange)){
				this.setTitle(aRange[i].title.__cdata);
				this.setContent(aRange[i].content.__cdata);
				break;
			}
		}
	};
		
	FeedbackPercentageBased.prototype._isPercentScoreInRange				= function( p_nPercentScore, p_oRange){
		var			aScoreRange			= (p_oRange !== '') ? p_oRange.split(' ').join('').split('-') : [];
		//Logger.logDebug('\taScoreRange.length = '+aScoreRange.length+' : '+aScoreRange);

		if(aScoreRange.length === 2){
			var nMinScoreRange	= Number(aScoreRange[0]),
				nMaxScoreRange	= Number(aScoreRange[1]),
				nPercentScore	= p_nPercentScore,
				bIsInRange		= (nPercentScore >= nMinScoreRange && nPercentScore <= nMaxScoreRange) ? true : false;
			//Logger.logDebug('\tChecking Score | Min = '+nMinScoreRange+' : Max = '+nMaxPossibleScore+' : User Score = '+nPercentScore);
			return bIsInRange;
		}else{
			Logger.logWarn('._getFBTypePercentageBased() | WARN: Invalid Score Range specified for Feedback');
		}

		return false;
	};		
	
	return FeedbackPercentageBased;
});
