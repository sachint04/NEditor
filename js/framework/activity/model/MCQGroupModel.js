define([
	'framework/activity/model/ActivityModelAbstract',
	'framework/core/feedback/History',
	'framework/utils/Logger'
], function(ComponentModelAbstract, History, Logger){

	function MCQGroupModel(p_xmlActivityNode,  p_sGUID, p_sScoringUID){
		//Logger.logDebug('MCQGroupModel.CONSTRUCTOR() ');
		ComponentModelAbstract.call(this, p_xmlActivityNode, p_sGUID, p_sScoringUID);
	}

	MCQGroupModel.prototype										= Object.create(ComponentModelAbstract.prototype);
	MCQGroupModel.prototype.constructor							= MCQGroupModel;

	MCQGroupModel.prototype.getOptionGroupsContainerClass		= function(){return this.oDataModel.optionGroups._class;};
	MCQGroupModel.prototype.getOptionGroupList					= function(){return this.oDataModel.optionGroups.optionGroup;};
	MCQGroupModel.prototype.getFeedbackType						= function(){return this.oDataModel._fbType;};

	MCQGroupModel.prototype.getBookmark							= function(){
		/*var oBookmark		= {maxPossibleScore	: this.oDataModel.maxPossibleScore,
							   nUserScore		: this.oDataModel.nUserScore,
							   aUserScore		: this.oDataModel.aUserScore,
							   aUserSelection	: this.oDataModel.aUserSelections};*/
		var oBookmark		= this.oScore;
		return oBookmark;
	};

	MCQGroupModel.prototype.parseBookmark						= function(p_oBookmark){
		if(this.oDataModel){
			/*
			this.oDataModel.maxPossibleScore	= p_oBookmark.maxPossibleScore;
						this.oDataModel.nUserScore			= p_oBookmark.nUserScore;
						this.oDataModel.aUserScore			= p_oBookmark.aUserScore;
						this.oDataModel.aUserSelection		= p_oBookmark.aUserSelections;*/

			return;
		}
		Logger.logError('MCQGroupModel.setBookmark() | Failed to set Bookmark. The Data Model does not exists.');
	};



	MCQGroupModel.prototype.getHistory						= function(p_aIDs){
	var x2jsOptionGroups	= this.getOptionGroupList(),
			oHistory,
			sOptionText,
			sOptionFbk,
			oHistory,
			sOptionID		= p_aIDs[0],
			sOptionGroupID	= p_aIDs[1],
			i;
			
		// ** Accumulate Option and Feedback Text
		for(i=0; i<x2jsOptionGroups.length; i++){
			var x2jsOptionGroup 		= x2jsOptionGroups[i];
			if(x2jsOptionGroup._id== sOptionGroupID)
			for(j=0;j<x2jsOptionGroup.option.length;j++)
			{
				var x2jsOptionPointer = x2jsOptionGroup.option[j];
				if(x2jsOptionPointer._id === sOptionID){
					var sQuestionText		= x2jsOptionGroup.pageText.__cdata,
						sOptionText 		= x2jsOptionPointer.pageText.__cdata,
						sFeedbackTitle ,
						sFeedbackContent;
					if( x2jsOptionPointer.feedback){
					var	sFeedbackTitle		= x2jsOptionPointer.feedback.title.__cdata,
						sFeedbackContent 	= x2jsOptionPointer.feedback.content.__cdata;
					}
					
					oHistory		= new  History('', sOptionText, sFeedbackTitle, sFeedbackContent);
					return oHistory;
				}
			}
		}
	};

	MCQGroupModel.prototype.getOptionalData				= function(p_oOptionalData){
		// START 
		
		// END
		ComponentModelAbstract.prototype.getOptionalData.call(this, p_oOptionalData);
	};



	MCQGroupModel.prototype.toString 						= function(){
			return 'framework/activity/model/MCQGroupModel';
		};

	return MCQGroupModel;
});