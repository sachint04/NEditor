define([
	'framework/activity/model/ActivityModelAbstract',
	'framework/core/feedback/History',
	'framework/utils/Logger'
], function(ComponentModelAbstract, History, Logger){

	function FIBModel(p_xmlActivityNode,  p_sGUID, p_sScoringUID){
		//Logger.logDebug('FIBModel.CONSTRUCTOR() ');
		ComponentModelAbstract.call(this, p_xmlActivityNode,  p_sGUID, p_sScoringUID);
	}

	FIBModel.prototype									= Object.create(ComponentModelAbstract.prototype);
	FIBModel.prototype.constructor						= FIBModel;

	FIBModel.prototype.getTypeInContainerClass			= function(){return this.oDataModel.typeIns._class;};
	FIBModel.prototype.getTypeInContainerList			= function(){return this.oDataModel.typeIns.typeInContainer;};
	FIBModel.prototype.getTypeInStatement				= function(p_nTypeInContainerIndex){
		var aTypeInContainers	= this.getTypeInContainerList(),
			oPageText = (aTypeInContainers.length && aTypeInContainers[p_nTypeInContainerIndex]) ? aTypeInContainers[p_nTypeInContainerIndex].pageText : aTypeInContainers.pageText;
		if(this.isArray(oPageText)){Logger.logError('FIBModel.getTypeInStatement() | ERROR: More the 1 "pageText" nodes found for "typeInContainer" number "'+(p_nTypeInContainerIndex + 1)+'". Each  "typeInContainer" node can have only a single "pageText" node');}
		return oPageText;
	};
	FIBModel.prototype.getTypeInList					= function(p_nTypeInContainerIndex){
		var aTypeInContainers	= this.getTypeInContainerList();
		if(aTypeInContainers.length){
			if(!aTypeInContainers[p_nTypeInContainerIndex]){Logger.logError('FIBModel.getTypeInList() | ERROR: Invalid "typeInContainer" index "'+(p_nTypeInContainerIndex + 1)+'".');}
			return aTypeInContainers[p_nTypeInContainerIndex].typeIn;
		}else{
			return aTypeInContainers.typeIn;
		}
	};
	FIBModel.prototype.getInputField					= function(p_nTypeInContainerIndex, p_nTypeInIndex){
		var aTypeInList	= this.getTypeInList(p_nTypeInContainerIndex),
			oInput = (aTypeInList.length) ? aTypeInList[p_nTypeInIndex].input : aTypeInList.input;
		if(this.isArray(oInput)){Logger.logError('FIBModel.getInputField() | ERROR: More the 1 "input" nodes found for "typeIn" number '+(p_nTypeInContainerIndex + 1)+'. Each  "typeIn" node can have only a single "input" node');}
		return oInput;
	};

	FIBModel.prototype.getBookmark						= function(){
		/*
		var oBookmark		= {maxPossibleScore	: this.oDataModel.maxPossibleScore,
									   nUserScore		: this.oDataModel.nUserScore,
									   aUserScore		: this.oDataModel.aUserScore,
									   aUserSelection	: this.oDataModel.aUserSelections};*/
		var oBookmark		= this.oScore;
		return oBookmark;
	};

	FIBModel.prototype.setBookmark						= function(p_oBookmark){
		if(this.oDataModel){
			/*
			this.oDataModel.maxPossibleScore	= p_oBookmark.maxPossibleScore;
						this.oDataModel.nUserScore			= p_oBookmark.nUserScore;
						this.oDataModel.aUserScore			= p_oBookmark.aUserScore;
						this.oDataModel.aUserSelection		= p_oBookmark.aUserSelections;*/
			
		}
		Logger.logError('FIBModel.setBookmark() | Faild to set Bookmark. The Data Model does not exists.');
	};

    

	FIBModel.prototype.getHistory = function (p_sGroupID, p_sOptionIDOrScore, p_bOptnBased) {
	   /* var aOptionGroup = this.oDataModel.optionGroups.optionGroup;

	    for (var i = 0; i < aOptionGroup.length; i++) {
	        if (aOptionGroup[i]._id == p_sGroupID) {
	            var aOption = aOptionGroup[i].option,
					sStatementTxt = aOptionGroup[i].pageText.__cdata;
	            for (var j = 0; j < aOption.length; j++) {
	                var paramToCompare = (p_bOptnBased) ? aOption[j]._id : aOption[j]._score;
	                if (paramToCompare == p_sOptionIDOrScore) {
	                    //var sRadioLabel = aOption[j].pageText.__cdata;
	                    var sQuestionText	= aOption[j].pageText.__cdata,
	                    //sOptionText 		= x2jsOptionPointer.pageText.__cdata,
						sFeedbackTitle		= aOption[j].feedback.title.__cdata,
						sFeedbackContent 	= aOption[j].feedback.content.__cdata;
				
						oHistory		= new  History(sQuestionText,'' , sFeedbackTitle, sFeedbackContent);
						return oHistory;
	                    //return { question: sStatementTxt, selection: sRadioLabel };
	                }
	            }
	        }
	    }*/
	    return null;
	};
	
	FIBModel.prototype.getOptionalData				= function(p_oOptionalData){
		// START 
		
		// END
		ComponentModelAbstract.prototype.getOptionalData.call(this, p_oOptionalData);
	};


	FIBModel.prototype.toString 				= function(){
		return 'framework/activity/model/FIBModel';
	};

	return FIBModel;
});