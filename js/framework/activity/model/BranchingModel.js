/**
 * @author BharatK
 * @modified Vincent Gomes
 */
define([
	'framework/activity/model/ActivityModelAbstract',
	'framework/core/feedback/History',
	'framework/utils/Logger'
], function(ComponentModelAbstract, History, Logger){


	function BranchingModel(p_xmlActivityNode,  p_sGUID, p_sScoringUID){
		//Logger.logDebug('BranchingModel.CONSTRUCTOR() ');

		ComponentModelAbstract.call(this, p_xmlActivityNode,  p_sGUID, p_sScoringUID);

	}

	BranchingModel.prototype												= Object.create(ComponentModelAbstract.prototype);
	BranchingModel.prototype.constructor									= BranchingModel;
/*
	BranchingModel.prototype.getOptionGroupsContainerClass	= function(){return this.oDataModel.optionGroups._class;};
	BranchingModel.prototype.getOptionGroupList				= function(){return this.oDataModel.optionGroups.optionGroup;};
*/

// Gets the initial Set for Branching
	BranchingModel.prototype.getInitialBranchingSet					= function(){
		//Initial is now default to 0 can be updated to get any set
		//return this.oDataModel.Root.SCENARIO.Branching.SET[0];
	};

// Gets the Set with the Setid provided in the parameter from the collection of Branching sets
	BranchingModel.prototype.getBranchingSet							= function(p_SetID){
		if(p_SetID==null||p_SetID==-1||p_SetID== undefined)
		{
			return this.oDataModel.optionGroups.optionGroup[0];
		}
		this.oDataModel.p_SetID		= p_SetID;
		var _noOfSets=this.oDataModel.optionGroups.optionGroup.length;
		var _arrSets=this.oDataModel.optionGroups.optionGroup;
		for(i=0;i<_noOfSets;i++){
			if(_arrSets[i]._id==p_SetID)
			{
				return _arrSets[i];
				break;
			}
		}

		return _arrSets[0];

	};

	// Gets the Question text
	BranchingModel.prototype.getBranchingQuestion						= function(p_CurrentSet){
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
	BranchingModel.prototype.getBranchingScenario						= function(p_CurrentSet){
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
	BranchingModel.prototype.getExpressions			= function(sExpressionID){
		if(sExpressionID==undefined){ return this.oDataModel.Root.SCENARIO.EXPRESSIONS.EXPRESSION;}
		return this.oDataModel.Root.SCENARIO.EXPRESSIONS.EXPRESSION[Number(sExpressionID)-1];
	};
	*/

/* get all classess for Branching*/

	BranchingModel.prototype.getBranchingID									= function(){
		return this.oDataModel._questionId;
	};

	BranchingModel.prototype.hasContinue                                	= function(){
        return (this.oDataModel._hasContinue.toLowerCase() === 'true');
    };

	BranchingModel.prototype.getBookmark									= function(){
		/*var oBookmark		= {maxPossibleScore	: this.oDataModel.maxPossibleScore,
							   nUserScore		: this.oDataModel.nUserScore,
							   aUserScore		: this.oDataModel.aUserScore,
							   aUserSelection	: this.oDataModel.aUserSelections};*/

		var oBookmark		= this.oScore;
		return oBookmark;

	};

	BranchingModel.prototype.parseBookmark								= function(p_oBookmark){
		if(this.oDataModel){

			this.oDataModel.maxPossibleScore	= p_oBookmark.maxPossibleScore;
						this.oDataModel.nUserScore			= p_oBookmark.nUserScore;
						this.oDataModel.aUserScore			= p_oBookmark.aUserScore;
						this.oDataModel.aUserSelection		= p_oBookmark.aUserSelections;
						return;
		}
		Logger.logError('BranchingModel.setBookmark() | Failed to set Bookmark. The Data Model does not exists.');

	};

	BranchingModel.prototype.getHistory				= function(p_aIDs){
		var sOptionID		= p_aIDs[0],
			sOptionGroupID	= p_aIDs[1],
			x2jsOptionGroup	= this.getBranchingSet(sOptionGroupID),
			oHistory,
			sOptionText,
			sQuestion,
			sStatement,
			sOptionFbk,
			oHistory,
			i;

		// ** Accumulate Option and Feedback Text
		for(var j=0 ; j<x2jsOptionGroup.pageText.length;j++){
			if(x2jsOptionGroup.pageText[j]._class=="question"){
				sQuestion = x2jsOptionGroup.pageText[j].__cdata;
			}
			if(x2jsOptionGroup.pageText[j]._class=="statement"){
				sStatement 	= x2jsOptionGroup.pageText[j].__cdata;
			}
		}

		for(j=0;j<x2jsOptionGroup.option.length;j++)
		{
			var x2jsOptionPointer = x2jsOptionGroup.option[j];
			if(x2jsOptionPointer._id === sOptionID){
				var sOptionText 		= x2jsOptionPointer.pageText.__cdata,
				sFeedbackTitle ,
				sFeedbackContent;
				if( x2jsOptionPointer.feedback){
				var	sFeedbackTitle		= x2jsOptionPointer.feedback.title.__cdata,
					sFeedbackContent 	= x2jsOptionPointer.feedback.content.__cdata;
				}				
				oHistory		= new  History(sQuestion, sOptionText, sFeedbackTitle, sFeedbackContent,{statement:sStatement});
				return oHistory;
			}
		}

		return oHistory;
	};

	BranchingModel.prototype.getOptionalData				= function(p_oOptionalData){
		// START

		// END
		ComponentModelAbstract.prototype.getOptionalData.call(this, p_oOptionalData);
	};


	/*
	BranchingModel.prototype.getHistory									= function(p_aUserSelection){


		var sOptionID 	= p_aUserSelection[0],
			sSetID		= p_aUserSelection[1],
			oSet	= this.getBranchingSet(sSetID),
			sOptionText,
			sOptionFbk;
		// ** Accumulate Option and Feedback Text
		for(i=0;i<oSet.option.length;i++){
			if(oSet.option[i]._id == sOptionID){
				sOptionText	= oSet.option[i].pageText.__cdata ;
				sOptionFbkTitle	= oSet.option[i].feedback.title.__cdata;
				sOptionFbk	= oSet.option[i].feedback.content.__cdata;
				break;
			}
		}

		// ** Accumulate Response Text
		var sQuestion		= this.getBranchingQuestion(oSet),
			sStatement		= this.getBranchingScenario(oSet);


			return {
					question		: sQuestion,
					option			: sOptionText,
					optionalData	: {
						feedback		: sOptionFbk,
						statement		: sStatement
					}
		};
	};

	*/


	BranchingModel.prototype.toString 									= function(){
		return 'framework/activity/model/BranchingModel';
	};

	return BranchingModel;
});