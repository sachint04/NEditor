define([
	'framework/activity/model/ActivityModelAbstract',
	'framework/core/feedback/History',
	'framework/utils/Logger'
], function(ComponentModelAbstract, History, Logger){

	function DropdownFIBModel(p_xmlActivityNode,  p_sGUID, p_sScoringUID){
		//Logger.logDebug('DropdownFIBModel.CONSTRUCTOR() ');
		ComponentModelAbstract.call(this, p_xmlActivityNode,  p_sGUID, p_sScoringUID);
	}

	DropdownFIBModel.prototype										= Object.create(ComponentModelAbstract.prototype);
	DropdownFIBModel.prototype.constructor							= DropdownFIBModel;


	DropdownFIBModel.prototype.isShowFeedbackPopup					= function(){return this.oDataModel._showFeedbackPopup;};
	DropdownFIBModel.prototype.getOptionGroupContainerClass			= function(){return this.oDataModel.optionGroups._class;};
	DropdownFIBModel.prototype.getOptionGroup			= function(){return this.oDataModel.optionGroups;};
	DropdownFIBModel.prototype.getOptionGroupStatement				= function(p_nOptionGroupContainerIndex){
		var aOptionGroupContainers	= this.getOptionGroup(),
			oPageText = aOptionGroupContainers.pageText;
			return oPageText;
	};
	DropdownFIBModel.prototype.getOptionGroupList					= function(){
		var aOptionGroupContainers	= this.getOptionGroup();
		
			return aOptionGroupContainers.optionGroup;
		
	};
	DropdownFIBModel.prototype.getInputField						= function(p_nOptionGroupContainerIndex, p_nOptionGroupIndex){
		var aOptionGroupList	= this.getOptionGroupList(p_nOptionGroupContainerIndex),
			oInput = (aOptionGroupList.length) ? aOptionGroupList[p_nOptionGroupIndex].input : aOptionGroupList.input;
		if(this.isArray(oInput)){Logger.logError('DropdownFIBModel.getInputField() | ERROR: More the 1 "input" nodes found for "OptionGroup" number '+(p_nOptionGroupContainerIndex + 1)+'. Each  "OptionGroup" node can have only a single "input" node');}
		return oInput;
	};
	DropdownFIBModel.prototype.getFeedbackType						= function(){return this.oDataModel._fbType;};

	DropdownFIBModel.prototype.getBookmark							= function(){
		/*var oBookmark		= {maxPossibleScore	: this.oDataModel.maxPossibleScore,
							   nUserScore		: this.oDataModel.nUserScore,
							   aUserScore		: this.oDataModel.aUserScore,
							   aUserSelection	: this.oDataModel.aUserSelections};*/
		var oBookmark		= this.oScore;
		return oBookmark;
	};

	DropdownFIBModel.prototype.parseBookmark						= function(p_oBookmark){
		if(this.oDataModel){
			/*
			this.oDataModel.maxPossibleScore	= p_oBookmark.maxPossibleScore;
						this.oDataModel.nUserScore			= p_oBookmark.nUserScore;
						this.oDataModel.aUserScore			= p_oBookmark.aUserScore;
						this.oDataModel.aUserSelection		= p_oBookmark.aUserSelections;*/

			return;
		}
		Logger.logError('DropdownFIBModel.setBookmark() | Failed to set Bookmark. The Data Model does not exists.');
	};


	DropdownFIBModel.prototype.getHistory				= function(p_aIDs){
		var x2jsOptionGroups	= this.getOptionGroup(),
			oHistory,
			sOptionText,
			sOptionFbk,
			oHistory,
			sOptionID		= p_aIDs[0],
			sOptionGroupID	= p_aIDs[1],
			i;
			
		// ** Accumulate Option and Feedback Text
		for(i=0; i<x2jsOptionGroups.optionGroup.length; i++){
			var x2jsOptionGroup 		= x2jsOptionGroups.optionGroup[i];
			if('DropdownGroup_'+x2jsOptionGroup._id== sOptionGroupID)
			for(j=0;j<x2jsOptionGroup.option.length;j++){
					var x2jsOptionPointer = x2jsOptionGroup.option[j];
					if(x2jsOptionPointer._id === sOptionID){
						var sOptionText 		= x2jsOptionPointer.pageText.__cdata,
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

		//return oHistory;
	};

	DropdownFIBModel.prototype.getOptionalData				= function(p_oOptionalData){
		// START 
		
		// END
		ComponentModelAbstract.prototype.getOptionalData.call(this, p_oOptionalData);
	};

	DropdownFIBModel.prototype.toString 							= function(){
			return 'framework/activity/model/DropdownFIBModel';
		};

	return DropdownFIBModel;
});