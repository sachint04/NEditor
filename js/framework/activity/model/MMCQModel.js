 /**
 * @author BharatK
 * @modified Vincent Gomes
 */
define([
	'framework/activity/model/ActivityModelAbstract',
	'framework/core/feedback/History',
	'framework/utils/Logger'
], function(ComponentModelAbstract, History, Logger){

	/**
	* Last edited by : Sachin Tumbre  -
	* Model may load dependent resources i.e. isap xml. hence it requires GUID and ScoringID
	*/
	function MMCQModel(p_xmlActivityNode,  p_sGUID, p_sScoringUID){
		//Logger.logDebug('MMCQModel.CONSTRUCTOR() ');
		ComponentModelAbstract.call(this, p_xmlActivityNode, p_sGUID, p_sScoringUID);
	}

	MMCQModel.prototype												= Object.create(ComponentModelAbstract.prototype);
	MMCQModel.prototype.constructor									= MMCQModel;

// Gets the initial Set for MMCQ
	MMCQModel.prototype.getInitialMMCQSet					= function(){
		//Initial is now default to 0 can be updated to get any set
		//return this.oDataModel.Root.SCENARIO.MMCQ.SET[0];
	};

// Gets the Set with the Setid provided in the parameter from the collection of MMCQ sets
	MMCQModel.prototype.getOptionGroup							= function(){
			return this.oDataModel.optionGroup;
	};

	// Gets the Question text
	MMCQModel.prototype.getMMCQQuestion						= function(p_CurrentSet){
		//Initial is now default to 0 can be updated to get any set
		for(var i=0;i<p_CurrentSet.pageText.length;i++){
			if(p_CurrentSet.pageText[i]._class.toLowerCase()=="question")
			{
				return p_CurrentSet.pageText[i].__cdata;
			}
		}
		return p_CurrentSet.pageText[0].__cdata;
	};

// Gets the Statement text
	MMCQModel.prototype.getMMCQScenario						= function(p_CurrentSet){
		//Initial is now default to 0 can be updated to get any set

		for(var i=0;i<p_CurrentSet.pageText.length;i++){
			if(p_CurrentSet.pageText[i]._class.toLowerCase()=="statement")
			{
				return p_CurrentSet.pageText[i].__cdata;
			}
		}
		return p_CurrentSet.pageText[0].__cdata;
	};


/* get all classess for MMCQ*/

	MMCQModel.prototype.getMMCQID									= function(){
		return this.oDataModel._questionId;
	};

	MMCQModel.prototype.getBookmark									= function(){
		/*var oBookmark		= {maxPossibleScore	: this.oDataModel.maxPossibleScore,
							   nUserScore		: this.oDataModel.nUserScore,
							   aUserScore		: this.oDataModel.aUserScore,
							   aUserSelection	: this.oDataModel.aUserSelections};*/

		var oBookmark		= this.oScore;
		return oBookmark;

	};

	MMCQModel.prototype.parseBookmark								= function(p_oBookmark){
		if(this.oDataModel){

			this.oDataModel.maxPossibleScore	= p_oBookmark.maxPossibleScore;
						this.oDataModel.nUserScore			= p_oBookmark.nUserScore;
						this.oDataModel.aUserScore			= p_oBookmark.aUserScore;
						this.oDataModel.aUserSelection		= p_oBookmark.aUserSelections;
						return;
		}
		Logger.logError('MMCQModel.setBookmark() | Failed to set Bookmark. The Data Model does not exists.');

	};

	MMCQModel.prototype.getHistory									= function(p_oUserSelection){
		var x2jsOptionGroup				= this.getOptionGroup(),
			sOptionGroupID				= p_oUserSelection.optionGroupID,
			sOptionID					= p_oUserSelection.optionID,
			sQuestionText				= this.getQuestionText(),
			oParameterHistoryCollection = {},
			sOptionText,
			sFeedbackTitle,
			sFeedbackContent,
			oHistory,
			i;
		//Logger.logDebug('MMCQModel.getHistory() | sOptionGroupID = '+sOptionGroupID+' : sOptionID = '+sOptionID);
		// ** Accumulate Option and Feedback Text
		for(i=0; i<x2jsOptionGroup.option.length; i++){
			var x2jsOptionPointer = x2jsOptionGroup.option[i];
			if(x2jsOptionPointer._id === sOptionID){
				var sOptionText 		= x2jsOptionPointer.pageText.__cdata;
				if( x2jsOptionPointer.feedback){
					sFeedbackTitle		= x2jsOptionPointer.feedback.title.__cdata;
					sFeedbackContent 	= x2jsOptionPointer.feedback.content.__cdata;
				}
				oHistory		= new  History((sQuestionText || ''), sOptionText, sFeedbackTitle, sFeedbackContent);
				//Logger.logDebug('\toHistory = '+JSON.stringify(oHistory));

				/* If option has parameters */
				if(x2jsOptionPointer.PARAMETER){
					var aParameters = x2jsOptionPointer.PARAMETER,
					sParameterID, nParameterValue;
					if(aParameters.length){
						for (var i=0; i < aParameters.length; i++) {
							var x2jsParameterPointer	= aParameters[i],
								sParameterID			= x2jsParameterPointer._ID,
								nParameterValue			= parseInt(x2jsParameterPointer._VALUE);
								if(nParameterValue > 0){
								// ** Add the response text, the selected option & the selected option feedback text to the Parameter History
								oParameterHistory	= {
										questionText 		: sQuestionText,
										optionText 			: sOptionText,
										feedbackTitle 		: sFeedbackTitle,
										feedbackContent 	: sFeedbackContent
									};
									oParameterHistoryCollection[sParameterID] = oParameterHistory;
								}
						}
					}else{
						sParameterID				= aParameters._ID;
						nParameterValue				= parseInt(aParameters._VALUE);
						if(nParameterValue > 0){
							// ** Add the response text, the selected option & the selected option feedback text to the Parameter History
							oParameterHistory		= {
								questionText 		: sQuestionText,
								optionText 			: sOptionText,
								feedbackTitle 		: sFeedbackTitle,
								feedbackContent 	: sFeedbackContent
							};
							oParameterHistoryCollection[sParameterID] = oParameterHistory;
						};
					}
				}
				break;
			}
		}

		return {
			history				: oHistory,
			parameterHistory	: oParameterHistoryCollection
		};


	};

	MMCQModel.prototype.isCorrect = function() {
	    var result; 	
		if(this.getFeedbackType().toUpperCase().indexOf('PARAMETERBASED')  === -1){
	       	var aUserScore 				= this.oScore.getUserScores(),
	       	totalScore					= 0;
	       	
        	for (var i = 0; i < aUserScore.length; i++) {
	            totalScore = totalScore + aUserScore[i]; 
        	}
        	 result  = (totalScore == this.oScore.getMaxPossibleScore());
        } 
        
        return result;
    };
	
	MMCQModel.prototype.getOptionalData								= function(p_oOptionalData){
		ComponentModelAbstract.prototype.getOptionalData.call(this, p_oOptionalData);
	};

	MMCQModel.prototype.destroy										= function(){
		ComponentModelAbstract.prototype.destroy.call(this);
		this.prototype		= null;
	};
	MMCQModel.prototype.toString 									= function(){
		return 'framework/activity/model/MMCQModel';
	};

	return MMCQModel;
});