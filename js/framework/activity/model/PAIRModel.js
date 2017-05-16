/**
 * @author BharatK
 * @modified Vincent Gomes
 */
define([
	'framework/activity/model/ActivityModelAbstract',
	'framework/core/feedback/History',
	'framework/utils/Logger'
], function(ComponentModelAbstract, History, Logger){


	function PAIRModel(p_xmlActivityNode,  p_sGUID, p_sScoringUID){
		//Logger.logDebug('PAIRModel.CONSTRUCTOR() ');
		ComponentModelAbstract.call(this, p_xmlActivityNode,  p_sGUID, p_sScoringUID);
	}

    PAIRModel.prototype = Object.create(ComponentModelAbstract.prototype);
    PAIRModel.prototype.constructor = PAIRModel;
    
     PAIRModel.prototype.getOptionGroupsContainerClass	= function(){return this.oDataModel._class;};
     PAIRModel.prototype.getOptionGroupList				= function(){return this.oDataModel.optionGroup;};
     

// Gets the initial Set for PAIR
	PAIRModel.prototype.getInitialPAIRSet					= function(){
		//Initial is now default to 0 can be updated to get any set
		//return this.oDataModel.Root.SCENARIO.PAIR.SET[0];
	};

// Gets the Set with the Setid provided in the parameter from the collection of PAIR sets
	PAIRModel.prototype.getOptionGroup							= function(History){
		
			
			return this.oDataModel.optionGroup;	
		

	};

	// Gets the Question text
	PAIRModel.prototype.getPAIRQuestion						= function(p_CurrentSet){
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
	PAIRModel.prototype.getPAIRScenario						= function(p_CurrentSet){
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
	PAIRModel.prototype.getExpressions			= function(sExpressionID){
		if(sExpressionID==undefined){ return this.oDataModel.Root.SCENARIO.EXPRESSIONS.EXPRESSION;}
		return this.oDataModel.Root.SCENARIO.EXPRESSIONS.EXPRESSION[Number(sExpressionID)-1];
	};
	*/

/* get all classess for PAIR*/

	PAIRModel.prototype.getPAIRID									= function(){
		return this.oDataModel._questionId;
	};

	PAIRModel.prototype.getBookmark									= function(){
		/*var oBookmark		= {maxPossibleScore	: this.oDataModel.maxPossibleScore,
							   nUserScore		: this.oDataModel.nUserScore,
							   aUserScore		: this.oDataModel.aUserScore,
							   aUserSelection	: this.oDataModel.aUserSelections};*/

		var oBookmark		= this.oScore;
		return oBookmark;

	};

	PAIRModel.prototype.parseBookmark								= function(p_oBookmark){
		if(this.oDataModel){

			this.oDataModel.maxPossibleScore	= p_oBookmark.maxPossibleScore;
						this.oDataModel.nUserScore			= p_oBookmark.nUserScore;
						this.oDataModel.aUserScore			= p_oBookmark.aUserScore;
						this.oDataModel.aUserSelection		= p_oBookmark.aUserSelections;
						return;
		}
		Logger.logError('PAIRModel.setBookmark() | Failed to set Bookmark. The Data Model does not exists.');

	};

	
	PAIRModel.prototype.getHistory				= function(p_oUserSelection){
		//Logger.logDebug('PAIRModel.getHistory() | User Selection = '+JSON.stringify(p_oUserSelection));
		var x2jsOptionGroup	= this.getOptionGroup(),
			sOptionGroupID	= p_oUserSelection.optionGroupID,
			sOptionID		= p_oUserSelection.optionID,
			sQuestionText	= this.getQuestionText(),
			
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
				break;
			}
		}

		return oHistory;
	};
	
	PAIRModel.prototype.getOptionalData				= function(p_oOptionalData){
		ComponentModelAbstract.prototype.getOptionalData.call(this, p_oOptionalData);
	};

	PAIRModel.prototype.destroy								= function(){
		ComponentModelAbstract.prototype.destroy.call(this);
		this.prototype			= null;
	};	
	
	PAIRModel.prototype.toString 									= function(){
		return 'framework/activity/model/PAIRModel';
	};

	return PAIRModel;
});