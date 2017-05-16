define([
	'framework/core/feedback/History',
	'framework/utils/Logger'
], function(History, Logger){
	
	function ParameterFeedback(p_oParameter){
		this.sID					= p_oParameter._ID;
		this.sName					= p_oParameter.NAME;
		this.sDescription			= p_oParameter.DESCRIPTION;
		this.aAssociatedParameters	= p_oParameter._AssociatedParameters;
		//this.nMaxPossibleScore		= Number(p_oParameter._MaxScore) || 0;

		//this.nWeight				= isNaN(Number(p_oParameter.WEIGHT)) ? 0 : Number(p_oParameter.WEIGHT);

		//Logger.logDebug('############ Parameter.CONSTRUCTOR() : '+this.nWeight+'\n'+JSON.stringify(p_oParameter));
		this.nPercentScore;
		
		this.sRangeID;
		this.sRangeName;
		this.sScoreRange;
		this.sGrade;
		this.sFeedbackTitle;
		this.sFeedbackText;
		
		this.aHistory;
	}
	/*
	function ParameterFeedback(p_sID, p_sName, p_nPercentScore, p_sRangeID, p_sRangeName, p_sGrade, p_sFeedbackText){
			//Logger.logDebug('ParameterFeedback.CONSTRUCTOR()');
			this.sID				= p_sID;
			this.sName				= p_sName;
			this.nPercentScore		= p_nPercentScore;
			this.sRangeID			= p_sRangeID;
			this.sRangeName			= p_sRangeName;
			this.sGrade				= p_sGrade;
			this.sFeedbackText		= p_sFeedbackText;
	
			this.aHistory;
		}*/
	
	ParameterFeedback.prototype	= {
		constructor							: ParameterFeedback,
		getID								: function(){return this.sID;},
		getName								: function(){return this.sName;},
		
		getPercentScore						: function(){return this.nPercentScore;},
		
		getRangeID							: function(){return this.sRangeID;},
		getRangeName						: function(){return this.sRangeName;},
		getScoreRange						: function(){return this.sScoreRange;},
		getGrade							: function(){return this.sGrade;},
		getFeedbackTitle					: function(){return this.sFeedbackTitle;},
		getFeedbackText						: function(){return this.sFeedbackText;},
		
		setPropertiesFromMatchedRange		: function(p_oParameterRange, p_nPercentScore){
			this.nPercentScore		= p_nPercentScore;
			this.sRangeID			= p_oParameterRange._ID;
			this.sRangeName			= p_oParameterRange._NAME;
			this.sScoreRange		= p_oParameterRange._SCORE;
			this.sGrade				= p_oParameterRange._GRADE;
			this.sFeedbackTitle		= p_oParameterRange._TITLE;
			this.sFeedbackText		= p_oParameterRange.__cdata;
		},
		
		getHistory							: function(){return this.aHistory;},
		/*
		 * 	History		: [p_oHistory, {...}]
		 *	
		 * @ p_oHistory	= {
				currentSetResponses		: [{characterID		: "1", name		: "Mr. X", response		: "..."}, 
										   {characterID		: "2", name		: "Mr. Y", response		: "..."}, ...],
				selectedOptionText		: "Selected Option Text",
				immediateFbkTitleText	: "Selected Option Feedback Text",
				immediateFbkContentText	: "Selected Option Feedback Text",
				nextSetResponses		: [{characterID		: "1", name		: "Mr. X", response		: "..."}, 
										   {characterID		: "2", name		: "Mr. Y", response		: "..."}, ...]
			}
		 */
		updateHistory						: function(p_oHistory, p_nIndex){
			if(!this.aHistory){this.aHistory = [];}
			if(!isNaN(p_nIndex) && this.checkHistoryInBounds(p_nIndex)){			
					this.aHistory[p_nIndex] = p_oHistory;
					return;
				}
				this.aHistory.push(p_oHistory);
		},
		reset						: function(){
			//Logger.logDebug('ParameterFeedback.reset() | ');
			this.aHistory = [];
		},

		/* Helper Methods */
		checkHistoryInBounds				: function(p_nIndex){
			if(p_nIndex > (this.aHistory.length-1)){Logger.logWarn('WARN: Index out of bounds. The index "'+p_nIndex+'" supplied is greater than the length of the history'); return false;}
			return true;
		},
		/*isHistory							: function(p_oHistory){
			//Logger.logDebug('Feedback.isHistory() | ');
			if(!p_oHistory instanceof History){Logger.logError('ERROR: Feedback.updateHistory() | History Objects needs to be an Instance of History Class');}
			return true;
		},*/
		
		
		destroy								: function(){
			this.sID					= null;
			this.sName					= null;
			this.sDescription			= null;
			this.aAssociatedParameters	= null;
			
			this.nPercentScore			= null;
			
			this.sRangeID				= null;
			this.sRangeName				= null;
			this.sScoreRange			= null;
			this.sGrade					= null;
			this.sFeedbackTitle			= null;
			this.sFeedbackText			= null;
			
			this.aHistory				= null;
			this.prototype				= null;
		}
	};

	return ParameterFeedback;
});
