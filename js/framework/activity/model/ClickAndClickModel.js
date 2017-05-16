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
	function DragAndDropModel(p_xmlActivityNode,  p_sGUID, p_sScoringUID){
		//Logger.logDebug('DragAndDropModel.CONSTRUCTOR() ');
		ComponentModelAbstract.call(this, p_xmlActivityNode,  p_sGUID, p_sScoringUID);
	}

	DragAndDropModel.prototype									= Object.create(ComponentModelAbstract.prototype);
	DragAndDropModel.prototype.constructor						= DragAndDropModel;
/*
	DragAndDropModel.prototype.getTileGroupsContainerClass	= function(){return this.oDataModel._class;};
	DragAndDropModel.prototype.getTileGroupList				= function(){return this.oDataModel.tileGroup;};
*/

// Gets the initial Set for DragDrop
	DragAndDropModel.prototype.getInitialDragDropSet					= function(){
		//Initial is now default to 0 can be updated to get any set
		//return this.oDataModel.Root.SCENARIO.DragDrop.SET[0];
	};

// Gets the Set with the Setid provided in the parameter from the collection of DragDrop sets
	DragAndDropModel.prototype.getTileGroup					= function(History){
			return this.oDataModel.tileGroup;	
	};

	DragAndDropModel.prototype.getTargetGroup					= function(History){
			return this.oDataModel.targetGroup;	
	};

	// Gets the Question text
	DragAndDropModel.prototype.getDragDropQuestion					= function(p_CurrentSet){
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
	DragAndDropModel.prototype.getDragDropScenario					= function(p_CurrentSet){
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
	DragAndDropModel.prototype.getExpressions			= function(sExpressionID){
		if(sExpressionID==undefined){ return this.oDataModel.Root.SCENARIO.EXPRESSIONS.EXPRESSION;}
		return this.oDataModel.Root.SCENARIO.EXPRESSIONS.EXPRESSION[Number(sExpressionID)-1];
	};
	*/

/* get all classess for DragDrop*/

	DragAndDropModel.prototype.getDragDropID							= function(){
		return this.oDataModel._questionId;
	};

	DragAndDropModel.prototype.getBookmark						= function(){
		/*var oBookmark		= {maxPossibleScore	: this.oDataModel.maxPossibleScore,
							   nUserScore		: this.oDataModel.nUserScore,
							   aUserScore		: this.oDataModel.aUserScore,
							   aUserSelection	: this.oDataModel.aUserSelections};*/

		var oBookmark		= this.oScore;
		return oBookmark;

	};

	DragAndDropModel.prototype.parseBookmark					= function(p_oBookmark){
		if(this.oDataModel){

			this.oDataModel.maxPossibleScore	= p_oBookmark.maxPossibleScore;
						this.oDataModel.nUserScore			= p_oBookmark.nUserScore;
						this.oDataModel.aUserScore			= p_oBookmark.aUserScore;
						this.oDataModel.aUserSelection		= p_oBookmark.aUserSelections;
						return;
		}
		Logger.logError('DragAndDropModel.setBookmark() | Failed to set Bookmark. The Data Model does not exists.');

	};

	
	DragAndDropModel.prototype.getHistory						= function(p_oUserSelection){
		//Logger.logDebug('DragAndDropModel.getHistory() | User Selection = '+JSON.stringify(p_oUserSelection));
		var x2jsOptionGroup				= this.getTileGroup(),
			sOptionGroupID				= p_oUserSelection.tileGroupID,
			sOptionID					= p_oUserSelection.tileID,
			sQuestionText				= this.getQuestionText(),
			oParameterHistoryCollection = {},
			x2jsOptionPointer,
			sOptionText,
			sFeedbackTitle,
			sFeedbackContent,
			
			oHistory,
			i;
		
		// ** Accumulate Option and Feedback Text
		for(i=0; i<x2jsOptionGroup.tile.length; i++){
			x2jsOptionPointer = x2jsOptionGroup.tile[i];
			if(x2jsOptionPointer._id === sOptionID){
				sOptionText 	= x2jsOptionPointer.pageText.__cdata;
				
				if(x2jsOptionPointer.feedback){
					sFeedbackTitle		= x2jsOptionPointer.feedback.title.__cdata;
					sFeedbackContent 	= x2jsOptionPointer.feedback.content.__cdata;
				}
				
				oHistory		= new  History((sQuestionText || ''), sOptionText, sFeedbackTitle, sFeedbackContent);
				
				/* If tile has parameters */
				if(x2jsOptionPointer.PARAMETER){
					var aParameters = x2jsOptionPointer.PARAMETER,
					sParameterID, nParameterValue; 
					if(aParameters.length){
						for (var i=0; i < aParameters.length; i++) {
							var x2jsParameterPointer	= aParameters[i],
								sParameterID			= x2jsParameterPointer._ID,
								nParameterValue			= parseInt(x2jsParameterPointer._VALUE);					
								if(nParameterValue > 0){
								// ** Add the response text, the selected tile & the selected tile feedback text to the Parameter History
									oParameterHistory	= {
										questionText 		: sQuestionText,
										tileText 			: sOptionText,
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
							// ** Add the response text, the selected tile & the selected tile feedback text to the Parameter History
							oParameterHistory		= {
								questionText 		: sQuestionText,
								tileText 			: sOptionText,
								feedbackTitle 		: sFeedbackTitle,
								feedbackContent 	: sFeedbackContent
							};
							oParameterHistoryCollection[sParameterID] = oParameterHistory;
						};
					}
				}
				
				break;
			}
		};
		
		return {
			history				: oHistory,
			parameterHistory	: oParameterHistoryCollection
		};
	};
	
	  DragAndDropModel.prototype.isPartiallyCorrect = function() {
	  	var result 	= true;
	  	var score		= Math.round(this.getPercentScore());
	  	if(score == 100 || score == 0){
	  		result = false;
	  	}
	  	return result;
	  };
	  
	  DragAndDropModel.prototype.getPercentScore = function() {
        var aSel 		= this.oScore.getUserSelections()[0],
        nScore			= 0,
        nMaxScore		= 0,
        
        result;
         for (var i=0; i < aSel.length; i++) {
          nScore 		+= aSel[i].score;
          nMaxScore 	+= aSel[i].maxScore;
        };
        result 			= (nScore/nMaxScore) * 100;
        
        return result;
    };
	
	DragAndDropModel.prototype.getOptionalData					= function(p_oOptionalData){
		ComponentModelAbstract.prototype.getOptionalData.call(this, p_oOptionalData);
	};

	DragAndDropModel.prototype.destroy							= function(){
		ComponentModelAbstract.prototype.destroy.call(this);
		this.prototype			= null;
	};	
	
	DragAndDropModel.prototype.toString 						= function(){
		return 'framework/activity/model/DragAndDropModel';
	};

	return DragAndDropModel;
});