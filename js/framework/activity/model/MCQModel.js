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
	function MCQModel(p_xmlActivityNode,  p_sGUID, p_sScoringUID){
		//Logger.logDebug('MCQModel.CONSTRUCTOR() ');
		ComponentModelAbstract.call(this, p_xmlActivityNode,  p_sGUID, p_sScoringUID);
	}

	MCQModel.prototype									= Object.create(ComponentModelAbstract.prototype);
	MCQModel.prototype.constructor						= MCQModel;
/*
	MCQModel.prototype.getOptionGroupsContainerClass	= function(){return this.oDataModel._class;};
	MCQModel.prototype.getOptionGroupList				= function(){return this.oDataModel.optionGroup;};
*/

// Gets the initial Set for MCQ
	MCQModel.prototype.getInitialMCQSet					= function(){
		//Initial is now default to 0 can be updated to get any set
		//return this.oDataModel.Root.SCENARIO.MCQ.SET[0];
	};

// Gets the Set with the Setid provided in the parameter from the collection of MCQ sets
	MCQModel.prototype.getOptionGroup					= function(History){
		return this.oDataModel.optionGroup;	
	};

	// Gets the Question text
	MCQModel.prototype.getMCQQuestion					= function(p_CurrentSet){
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
	MCQModel.prototype.getMCQScenario					= function(p_CurrentSet){
		//Initial is now default to 0 can be updated to get any set
		
		for(var i=0;i<p_CurrentSet.pageText.length;i++){
			if(p_CurrentSet.pageText[i]._class.toLowerCase()=="statement")
			{
				return p_CurrentSet.pageText[i].__cdata;
			}
				
		}
		return p_CurrentSet.pageText[0].__cdata;
	};


/* Gets expressions object or collection
	MCQModel.prototype.getExpressions			= function(sExpressionID){
		if(sExpressionID==undefined){ return this.oDataModel.Root.SCENARIO.EXPRESSIONS.EXPRESSION;}
		return this.oDataModel.Root.SCENARIO.EXPRESSIONS.EXPRESSION[Number(sExpressionID)-1];
	};
	*/

/* get all classess for MCQ*/

	MCQModel.prototype.getMCQID							= function(){
		return this.oDataModel._questionId;
	};

	MCQModel.prototype.getBookmark						= function(){
		/*var oBookmark		= {maxPossibleScore	: this.oDataModel.maxPossibleScore,
							   nUserScore		: this.oDataModel.nUserScore,
							   aUserScore		: this.oDataModel.aUserScore,
							   aUserSelection	: this.oDataModel.aUserSelections};*/

		var oBookmark		= this.oScore;
		return oBookmark;

	};

	MCQModel.prototype.parseBookmark					= function(p_oBookmark){
		if(this.oDataModel){

			this.oDataModel.maxPossibleScore	= p_oBookmark.maxPossibleScore;
						this.oDataModel.nUserScore			= p_oBookmark.nUserScore;
						this.oDataModel.aUserScore			= p_oBookmark.aUserScore;
						this.oDataModel.aUserSelection		= p_oBookmark.aUserSelections;
						return;
		}
		Logger.logError('MCQModel.setBookmark() | Failed to set Bookmark. The Data Model does not exists.');

	};

	
	MCQModel.prototype.getHistory						= function(p_oUserSelection){
		//Logger.logDebug('MCQModel.getHistory() | User Selection = '+JSON.stringify(p_oUserSelection));
		var x2jsOptionGroup				= this.getOptionGroup(),
			sOptionGroupID				= p_oUserSelection.optionGroupID,
			sOptionID					= p_oUserSelection.optionID,
			sQuestionText				= this.getQuestionText(),
			oParameterHistoryCollection = {},
			x2jsOptionPointer,
			sOptionText,
			sFeedbackTitle,
			sFeedbackContent,
			
			oHistory,
			i;
		
		// ** Accumulate Option and Feedback Text
		for(i=0; i<x2jsOptionGroup.option.length; i++){
			x2jsOptionPointer = x2jsOptionGroup.option[i];
			if(x2jsOptionPointer._id === sOptionID){
				sOptionText 	= x2jsOptionPointer.pageText.__cdata;
				
				if(x2jsOptionPointer.feedback){
					sFeedbackTitle		= x2jsOptionPointer.feedback.title.__cdata;
					sFeedbackContent 	= x2jsOptionPointer.feedback.content.__cdata;
				}
				
				oHistory		= new  History((sQuestionText || ''), sOptionText, sFeedbackTitle, sFeedbackContent);
				
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
	
	MCQModel.prototype.getOptionalData					= function(p_oOptionalData){
		ComponentModelAbstract.prototype.getOptionalData.call(this, p_oOptionalData);
	};

	MCQModel.prototype.destroy							= function(){
		ComponentModelAbstract.prototype.destroy.call(this);
		this.prototype			= null;
	};	
	
	MCQModel.prototype.toString 						= function(){
		return 'framework/activity/model/MCQModel';
	};

	return MCQModel;
});