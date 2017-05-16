define([
	'framework/activity/model/ActivityModelAbstract',
	'framework/core/feedback/History',
	'framework/utils/Logger'
], function(ComponentModelAbstract, History, Logger){

	function MultipleDropdownGroupModel(p_xmlActivityNode,  p_sGUID, p_sScoringUID){
		//Logger.logDebug('MultipleDropdownGroupModel.CONSTRUCTOR() ');
		ComponentModelAbstract.call(this, p_xmlActivityNode,  p_sGUID, p_sScoringUID);
	}

	MultipleDropdownGroupModel.prototype										= Object.create(ComponentModelAbstract.prototype);
	MultipleDropdownGroupModel.prototype.constructor							= MultipleDropdownGroupModel;


	MultipleDropdownGroupModel.prototype.isGroup								= function(){return this.oDataModel.optionGroups.length>0?true:false;};
	MultipleDropdownGroupModel.prototype.getOptionGroupsContainerClass			= function(index){
		var sClassName,
			aOptionGroupsPointer	= this.oDataModel.optionGroups;

		if(aOptionGroupsPointer.length){
			sClassName	= (index >= 0) ? aOptionGroupsPointer[index]._class : aOptionGroupsPointer[0]._class;
		}else{
			sClassName	= aOptionGroupsPointer._class;
		}
		return sClassName;
	};
	MultipleDropdownGroupModel.prototype.getOptionGroupsID						= function(index){
		var sID,
			aOptionGroupsPointer	= this.oDataModel.optionGroups;

		if(aOptionGroupsPointer.length){
			sID	= (index >= 0) ? aOptionGroupsPointer[index]._id : aOptionGroupsPointer[0]._id;
		}else{
			sID	= aOptionGroupsPointer._id;
		}
		return sID;
	};
	MultipleDropdownGroupModel.prototype.getOptionGroup							= function(index){
		if(this.oDataModel.optionGroups.length==0){index=0;}
		return this.oDataModel.optionGroups[index].optionGroup;
	};
	MultipleDropdownGroupModel.prototype.getOptionGroupCollection				= function(p_nIndex){
		//Logger.logDebug('getOptionGroupCollection() | Index = '+p_nIndex+' : Option Groups Length = '+this.oDataModel.optionGroups.length);
		if(p_nIndex != null){
			//Logger.logDebug('getOptionGroupCollection() | '+JSON.stringify(this.oDataModel.optionGroups[p_nIndex]));
			return this.oDataModel.optionGroups[p_nIndex];
		}else{
			return this.oDataModel.optionGroups;
		}
	};
	MultipleDropdownGroupModel.prototype.getFeedbackType						= function(){return this.oDataModel._fbType;};

	MultipleDropdownGroupModel.prototype.getBookmark							= function(){
		/*var oBookmark		= {maxPossibleScore	: this.oDataModel.maxPossibleScore,
							   nUserScore		: this.oDataModel.nUserScore,
							   aUserScore		: this.oDataModel.aUserScore,
							   aUserSelection	: this.oDataModel.aUserSelections};*/
		var oBookmark		= this.oScore;
		return oBookmark;
	};

	MultipleDropdownGroupModel.prototype.parseBookmark						= function(p_oBookmark){
		if(this.oDataModel){
			/*
			this.oDataModel.maxPossibleScore	= p_oBookmark.maxPossibleScore;
						this.oDataModel.nUserScore			= p_oBookmark.nUserScore;
						this.oDataModel.aUserScore			= p_oBookmark.aUserScore;
						this.oDataModel.aUserSelection		= p_oBookmark.aUserSelections;*/

			return;
		}
		Logger.logError('MultipleDropdownGroupModel.setBookmark() | Failed to set Bookmark. The Data Model does not exists.');
	};


	MultipleDropdownGroupModel.prototype.getHistory				= function(p_oUserSelection){
		//Logger.logDebug('MultipleDropdownGroupModel.getHistory() | p_oUserSelection = '+JSON.stringify(p_oUserSelection));
		var oHistory,

			//nOptionGroupsIndex	= parseInt(p_oUserSelection[1].replace(/MultipleDropdownGroup_/i,"").split("_")[0] ),
			nOptionGroupsIndex	= p_oUserSelection.groupIDIndex,
			aOptionGroupID		= p_oUserSelection.dropDownIDs,
			aOptionID			= p_oUserSelection.selectedOptionIDs,
			x2jsOptionsGroup	= this.getOptionGroupCollection(nOptionGroupsIndex),
			x2jsOptionGroup		= this.getOptionGroup(nOptionGroupsIndex),
			sQuestionText		= this.getQuestionText(),

			i,
			j;
		//Logger.logDebug('\tp_oUserSelection = '+p_oUserSelection+' : nOptionGroupsIndex = '+nOptionGroupsIndex+' : aOptionGroupID = '+aOptionGroupID+' : aOptionID = '+aOptionID/*+'\n\t'+JSON.stringify(x2jsOptionsGroup)*/);

		var sStatement			= x2jsOptionsGroup.pageText.__cdata,
			aOptionText			= [],
			aFeedback			= [];
		//Logger.logDebug('oOptionsGroup | '+JSON.stringify(x2jsOptionsGroup));
		// ** Accumulate Option and Feedback Text
		for(i=0; i<x2jsOptionsGroup.optionGroup.length; i++){
			var x2jsOptionGroup 		= x2jsOptionsGroup.optionGroup[i];
			//Logger.logDebug('\tI = '+i+' : Option Group ID = '+aOptionGroupID[i]+' :: COMPARE :: '+x2jsOptionGroup._id);

			if(x2jsOptionGroup._id == aOptionGroupID[i]){
				var x2jsOptionList	= x2jsOptionGroup.option;

				for(j=0; j<x2jsOptionList.length; j++){
					var x2jsOptionPointer = x2jsOptionList[j];
					//Logger.logDebug('\t\tJ = '+j+' : Option ID = '+aOptionID[i]+' :: COMPLARE :: '+x2jsOptionPointer._id);

					if(x2jsOptionPointer._id === aOptionID[i]){
						//var sOptionText 		= x2jsOptionPointer.pageText.__cdata,
						aOptionText.push(x2jsOptionPointer.pageText.__cdata);

						if( x2jsOptionPointer.feedback){
							aFeedback.push({
								title	: x2jsOptionPointer.feedback.title.__cdata,
								content	: x2jsOptionPointer.feedback.content.__cdata
							});
						}
						//Logger.logDebug('\tsStatement = '+sStatement+'\n\taOptionText = '+aOptionText);
						break;
					}
				}
			}
		}
		//oHistory		= new  History((sStatement || sQuestionText || ''), sOptionText, sFeedbackTitle, sFeedbackContent);
		oHistory		= new  History((sStatement || sQuestionText || ''), aOptionText, null, aFeedback);
		return oHistory;
	};

	MultipleDropdownGroupModel.prototype.getOptionalData				= function(p_oOptionalData){
		// START

		// END
		ComponentModelAbstract.prototype.getOptionalData.call(this, p_oOptionalData);
	};




	MultipleDropdownGroupModel.prototype.toString 						= function(){
			return 'framework/activity/model/MultipleDropdownGroupModel';
		};

	return MultipleDropdownGroupModel;
});