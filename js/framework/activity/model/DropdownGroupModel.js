define([
	'framework/activity/model/ActivityModelAbstract',
	'framework/core/feedback/History',
	'framework/utils/Logger'
], function(ComponentModelAbstract, History, Logger){

	function DropdownGroupModel(p_xmlActivityNode,  p_sGUID, p_sScoringUID){
		//Logger.logDebug('DropdownGroupModel.CONSTRUCTOR() ');
		ComponentModelAbstract.call(this, p_xmlActivityNode,  p_sGUID, p_sScoringUID);
	}

	DropdownGroupModel.prototype										= Object.create(ComponentModelAbstract.prototype);
	DropdownGroupModel.prototype.constructor							= DropdownGroupModel;

	DropdownGroupModel.prototype.getOptionGroupsContainerClass			= function(){return this.oDataModel.optionGroups._class;};
	DropdownGroupModel.prototype.getOptionGroup							= function(){return this.oDataModel.optionGroups.optionGroup;};
	DropdownGroupModel.prototype.getFeedbackType						= function(){return this.oDataModel._fbType;};

	DropdownGroupModel.prototype.getBookmark							= function(){
		/*var oBookmark		= {maxPossibleScore	: this.oDataModel.maxPossibleScore,
							   nUserScore		: this.oDataModel.nUserScore,
							   aUserScore		: this.oDataModel.aUserScore,
							   aUserSelection	: this.oDataModel.aUserSelections};*/
		var oBookmark		= this.oScore;
		return oBookmark;
	};

	DropdownGroupModel.prototype.parseBookmark						= function(p_oBookmark){
		if(this.oDataModel){
			/*
			this.oDataModel.maxPossibleScore	= p_oBookmark.maxPossibleScore;
						this.oDataModel.nUserScore			= p_oBookmark.nUserScore;
						this.oDataModel.aUserScore			= p_oBookmark.aUserScore;
						this.oDataModel.aUserSelection		= p_oBookmark.aUserSelections;*/

			return;
		}
		Logger.logError('DropdownGroupModel.setBookmark() | Failed to set Bookmark. The Data Model does not exists.');
	};


	DropdownGroupModel.prototype.getHistory				= function(p_aIDs){
		var x2jsOptionGroups	= this.getOptionGroup(),
			sQuestionText		= this.getQuestionText(),
			oHistory,
			sOptionText,
			sOptionFbk,
			oHistory,
			sOptionID		= p_aIDs[0],
			sOptionGroupID	= p_aIDs[1],
			i;
			
		// ** Accumulate Option and Feedback Text
		for(i=0; i<x2jsOptionGroups.length; i++){
			var x2jsOptionGroup 		= x2jsOptionGroups[i],
				sStatement				= x2jsOptionGroup.pageText.__cdata;
			
			if('DropdownGroup_'+x2jsOptionGroup._id == sOptionGroupID){
				for(j=0;j<x2jsOptionGroup.option.length;j++){
					var x2jsOptionPointer	= x2jsOptionGroup.option[j];
						
					if(x2jsOptionPointer._id === sOptionID){
						var sOptionText 		= x2jsOptionPointer.pageText.__cdata,
							sFeedbackTitle ,
							sFeedbackContent;
							
						if( x2jsOptionPointer.feedback){
							var	sFeedbackTitle		= x2jsOptionPointer.feedback.title.__cdata,
								sFeedbackContent 	= x2jsOptionPointer.feedback.content.__cdata;
						}
						
						oHistory		= new  History((sStatement || sQuestionText || ''), sOptionText, sFeedbackTitle, sFeedbackContent);
						return oHistory;
					}
				}
			}
		}

		//return oHistory;
	};

	DropdownGroupModel.prototype.getOptionalData				= function(p_oOptionalData){
		// START 
		
		// END
		ComponentModelAbstract.prototype.getOptionalData.call(this, p_oOptionalData);
	};




	DropdownGroupModel.prototype.toString 						= function(){
			return 'framework/activity/model/DropdownGroupModel';
		};

	return DropdownGroupModel;
});