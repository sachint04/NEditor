define([
	'framework/core/feedback/Feedback',
	'framework/utils/Logger',
], function(Feedback, Logger){
	var __instanceFeedbackManager;

	function FeedbackManager() {
		//Logger.logDebug('FeedbackManager.CONSTRUCTOR() | '+this);
		this.oFeedbacks		= {};
		this.nFeedbackLength	= 0;
	}

	FeedbackManager.prototype.addFeedback							= function(p_oFeedback){
		var sQstnID	= p_oFeedback.getQuestionID();
		if(!p_oFeedback instanceof Feedback){Logger.logError('FeedbackManager.addFeedback() | ERROR: The argument supplied needs to be an instance of the "Feedback" Object');}
		if(this.oFeedbacks[sQstnID]){Logger.logWarn('FeedbackManager.addFeedback() | ERROR: Duplicate Feedback | Question ID. Feedback Object with ID "'+sQstnID+'" already exists');}
		this.oFeedbacks[sQstnID]	= p_oFeedback;
		this.nFeedbackLength		+= 1;
		//Logger.logDebug('FeedbackManager.addFeedback() | Qstn ID = '+sQstnID+' : Feedback = '+this.oFeedbacks[sQstnID].getQuestionID());
	};

	FeedbackManager.prototype.getFeedback							= function(p_qstnID){
		//Logger.logDebug('FeedbackManager.getFeedback() : Qstn ID = '+p_qstnID);
		var o = this.oFeedbacks[p_qstnID];
		if(!o){Logger.logWarn('FeedbackManager.getFeedback() | WARN: Feedback Object with ID "'+p_qstnID+'" not found.');}
		return o;
	};

	FeedbackManager.prototype.getFeedbackLength					= function(){
		//Logger.logDebug('FeedbackManager.getTotalPercentFeedback() | ');
		return this.nFeedbackLength;
	};

	FeedbackManager.prototype.toString							= function(){
		return 'framework/core/feedback/FeedbackManager';
	};

	if(!__instanceFeedbackManager){
		__instanceFeedbackManager = new FeedbackManager();
		//Logger.logDebug('^^^^^^^^^^^^ FeedbackManager INSTANCE ^^^^^^^^^^^^^^ '+__instanceFeedbackManager);
	}

	return __instanceFeedbackManager;
});