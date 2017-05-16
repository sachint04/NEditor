define([
	'jquery',
	'framework/utils/globals',
	'framework/activity/viewcontroller/ActivityAbstract',
	'framework/activity/model/MultipleDropdownGroupModel',
	'framework/activity/viewcontroller/Dropdown',
	'framework/utils/Logger'
], function($, Globals, ComponentAbstract, MultipleDropdownGroupModel, Dropdown, Logger){

	function MultipleDropdownGroup(){
		//Logger.logDebug('MultipleDropdownGroup.CONSTRUCTOR() ');
		ComponentAbstract.call(this);
		this.aDDList = [];
		this.nMaxPossibleScore = 0;
		this.nTabIndex=0;
		this.DDhandleEvents = this._handleEvents.bind(this);
		return this;
	}

	MultipleDropdownGroup.prototype								= Object.create(ComponentAbstract.prototype);
	MultipleDropdownGroup.prototype.constructor					= MultipleDropdownGroup;

	MultipleDropdownGroup.prototype.init						= function(p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation){
		//Logger.logDebug('MultipleDropdownGroup.init() ');
		// ** Calling Super Class "init()" function
		ComponentAbstract.prototype.init.call(this, p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation);
	};

	MultipleDropdownGroup.prototype._createDataModel			= function(p_xmlActivityNode){
		this.oDataModel = new MultipleDropdownGroupModel(p_xmlActivityNode,  this.sGUID, this.sScoringUID);

		/*** Listener to the DATA MODEL can be added here to listen to Model updates ***/
		/*this.oDataModel.addEventListener('UPDATE', function(e){
			oScope.handleModelUpdates(e);
		});*/
	};

	/*** Model updates Handler to be used if required ***/
	/*MultipleDropdownGroup.prototype.handleModelUpdates		= function(e){

	};*/

	MultipleDropdownGroup.prototype._populateLayout				= function(){
		var oScope				= this,
			sQuestionID			= this.oDataModel.getQuestionID(),
			sOptnGrpsCntnrClass	= this.oDataModel.getOptionGroupsContainerClass(),
			aOptionGroups		= this.oDataModel.getOptionGroupCollection(),
			$domActivity		= this.getElementByID(this.$domView, sQuestionID),
			$domOptnGrpList		= null,
			i;

		for( i=0;i<aOptionGroups.length;i++){
			//generates each row
			var sStmntTxt			= aOptionGroups[i].pageText.__cdata,
				sStmntClass			= aOptionGroups[i].pageText._class;

			this._populateOptionGroup(i, sStmntTxt, sStmntClass);
		}

		this.oDataModel.setMaxPossibleScore(this.nMaxPossibleScore);
		//Logger.logDebug('nMaxPossibleScore = '+this.nMaxPossibleScore);
		var sSubmitID = sQuestionID+'_submit';
		this.$btnSubmit = $('#'+sSubmitID+'.btn-submit');
		this.$btnSubmit.addClass('btn disabled').attr({
			/* START - ARIA Implementation */
			'role'			: 'button',
			/* END - ARIA Implementation */
			'tabindex'		: (this.nTabIndex+1)
		}).on('click', function(e){
			e.preventDefault();
			if(oScope.isBtnActive(this)){
				e.type = 'SUBMIT';
				oScope._handleEvents(e);
			}
		});
		this.enableSubmit(false);
		this.bLoaded = true;
		this.dispatchEvent("ACTIVITY_LOADED", {target:this, type:'ACTIVITY_LOADED', GUID:this.sGUID, eventID:this.sEventID, incidentID:this.sIncidentID});
	};

	//populates one optiongroup array (1 row in table)
	MultipleDropdownGroup.prototype._populateOptionGroup				= function(p_RowIndex, p_sStmntTxt, p_sStmntClass){
		var oScope				= this,
			sQuestionID			= this.oDataModel.getQuestionID(),
			sOptnGrpsID			= this.oDataModel.getOptionGroupsID(p_RowIndex),
			sOptnGrpsCntnrClass	= this.oDataModel.getOptionGroupsContainerClass(p_RowIndex),
			aOptionGroups		= this.oDataModel.getOptionGroup(p_RowIndex),
			$domActivity		= this.getElementByID(this.$domView, sQuestionID),

			$domOptnGrpList		= null;

		//this.nTabIndex = 0;

		// ** Check to make sure that an element with the specified Question ID exists in the DOM
		this._hasQuestionContainer(this, $domActivity, sQuestionID);

		///dropdown-groups-container
		var $domOptnGrpsCntnr = this.getElementByClassName($domActivity, sOptnGrpsCntnrClass);
		// ** Check to make sure that a Radio Group Container exists in the DOM to hold the Groups of Radio Button Containers
		this._hasOptionGroupCotainer($domOptnGrpsCntnr, sOptnGrpsCntnrClass, sQuestionID);

		/* START - ARIA Implementation */
		$domActivity.attr({
			'role'		: 'application',
			'tabindex'	: -1
		});
		/* END - ARIA Implementation */


		//Statement
		var $domOptnStmnt	= this.getElementByClassName($domOptnGrpsCntnr, p_sStmntClass);
		$($domOptnStmnt[p_RowIndex]).html(p_sStmntTxt).attr('id', sStatementID);

		// ** Iterarating within the Option Group Node
		for(var i=0; i<aOptionGroups.length; i++){
			var oOptionGroupPointer = aOptionGroups[i],
				sOptnGrpClass		= oOptionGroupPointer._class,
				$domOptnList		= null,

				// ** Custom Vars
				sStatementID		= 'dropdown_'+(p_RowIndex+1)+'_label';

			if(!$domOptnGrpList){
				$domOptnGrpList	= this.getElementByClassName($domOptnGrpsCntnr, sOptnGrpClass);
				//Logger.logDebug("$domOptnGrpList"+JSON.stringify($domOptnGrpList	,null,4)	)
				//Logger.logDebug('aOptionGroups.length '+aOptionGroups.length);
				// ** Check if the number of XML nodes for Radio Containers are Equal to the Number of Radio Containers in the DOM
				//if(aOptionGroups.length != $domOptnGrpList.length && this.oDataModel.isGroup()){Logger.logError('MultipleDropdownGroup._populateLayout() | Number of Dropdown Containers in the XML dont Match with the DOM');}
			}
			$domOptnGrpPointer = $($domOptnGrpList[p_RowIndex]);

			//this.createOptionCollectionForDropdown(aOptionGroups.length, $domOptnGrpPointer, oOptionGroupPointer, i, sStatementID, sOptnGrpsID);
			this.createOptionCollectionForDropdown(aOptionGroups.length, $domOptnGrpPointer, oOptionGroupPointer, i, sStatementID, p_RowIndex);

		}
	};

	MultipleDropdownGroup.prototype.createOptionCollectionForDropdown				= function(p_nOptionGroupsLength, p_$domOptnGrpPointer, p_oOptionGroupPointer,  p_nDropdownIndex, p_sStatementID, p_nOptionGroupsIndex){
		//Logger.logDebug("MultipleDropdownGroup.createOptionCollectionForDropdown() | ");
		var nMaxScore		= 0,
			sOptnGrpID		= 'MultipleDropdownGroup_'+p_nOptionGroupsIndex + "_" + p_oOptionGroupPointer._id,
			aOptionsList	= [];

		for(var j=0; j<p_oOptionGroupPointer.option.length; j++){
			var oOption						= p_oOptionGroupPointer.option[j];
				oOption.sOptnID				= oOption._id;
				oOption.sOptnClass			= oOption._class;
				oOption.nOptnScore			= Number(oOption._score);
				oOption.aOptnParameters		= oOption.parameter;
				oOption.sOptnLblClass		= oOption.pageText._class;
				oOption.sOptnLblTxt			= oOption.pageText.__cdata;
				nMaxScore 					= Math.max(nMaxScore, oOption.nOptnScore),
				sOptnClass					= oOption._class;

			aOptionsList.push(oOption);
		}

		//Logger.logDebug("\tOptn Lbl Txt = "+aOptionsList[0].sOptnLblTxt);

		var $domOptn		= $(this.getElementByClassName(p_$domOptnGrpPointer, sOptnClass)[p_nDropdownIndex]),
			nNumOfOptions	= p_nOptionGroupsLength;
			this.nTabIndex		+= 1;
		$domOptn.attr({
			/* START - ARIA Implementation */
			'role'				: 'combobox',
			'aria-labelledby'			: p_sStatementID,
			/*'aria-activedescendant'		: 'rg1-r4'*/
			'tabindex'			: this.nTabIndex,
			/*'aria-readonly'		: true,
			'aria-autocomplete'	: 'none',*/
			'aria-posinset'		: (p_nDropdownIndex+1),
		 	'aria-setsize'		: nNumOfOptions
			/* END - ARIA Implementation */
		});

		//this._hasOptionContainer($domOptn, sOptnClass, index, sOptnGrpClass);

		this.createDropdown($domOptn, sOptnGrpID, aOptionsList);

		this.nMaxPossibleScore += nMaxScore;
	};

	MultipleDropdownGroup.prototype.createDropdown				= function(p_domOptn, p_sOptnGrpID, p_aOptionsList){
		//Logger.logDebug("MultipleDropdownGroup.createDropdown() | Optn Grp ID = "+p_sOptnGrpID);
		var oScope	= this,
			oDD = new Dropdown(p_domOptn,  p_sOptnGrpID,  p_aOptionsList);

		oDD.addEventListener('OPTION_SELECT', this.DDhandleEvents);

		this.aDDList.push(oDD);
	};

	MultipleDropdownGroup.prototype._handleEvents				= function(e){
		if(typeof e.preventDefault == 'function'){e.preventDefault();}
		var target			= e.target,
			currentTarget	= e.currentTarget,
			type			= e.type;

		//Logger.logDebug('-------------------MultipleDropdownGroup._handleEvents() | Target = '+ target.getSelectedOption());

		switch(type){
			case 'OPTION_SELECT':
				this._dispatchSelectEvent(e);
				this._checkAndEnableSubmit();
				break;
			case 'SUBMIT':
				this._evaluate();
				break;
		}
	};

	MultipleDropdownGroup.prototype._dispatchSelectEvent		= function(e){
		this.dispatchEvent('OPTION_SELECT', {type:'OPTION_SELECT', target:e.target});
	};

	MultipleDropdownGroup.prototype._checkAndEnableSubmit		= function(p_optionID){
		for(var i=0; i<this.aDDList.length; i++){
			var oDD = this.aDDList[i];
			if(!oDD.getSelectedOption()){
				this.enableSubmit(false);
				return;
			}
		}
		this.enableSubmit(true);
	};
/*
	MultipleDropdownGroup.prototype._evaluate							= function(){
		//Logger.logDebug("eVEALUATE () | ");

		// ** Updating Score
		for(var i=0;i<this.aDDList.length;i++){
			var oToggleGrp						= this.aDDList[i],
				//oSelectedOption					= oToggleGrp.getSelectedOption();
				sfbType				= this.oDataModel.getFeedbackType().toUpperCase();
				if(sfbType == "PARAMETERBASEDFEEDBACK"){
					this.updateScoreAndUserSelections(oToggleGrp.getParameters(), [oToggleGrp.getSelectedOption(),oToggleGrp.getGroupID()]);

				}
				else{
					this.updateScoreAndUserSelections(oToggleGrp.getScore(),[oToggleGrp.getSelectedOption(),oToggleGrp.getGroupID()]);
				}
		}
		// ** Feedback
		this.oDataModel.getFeedback(true);
		//Logger.logDebug('DropdownGrp._evaluate() | FB = '+JSON.stringify(this.getFeedback()));
		// ** Bookmark
		this.getBookmark();

		this.processFeedbackPopup();

		this.enableSubmit(false);
	};

	MultipleDropdownGroup.prototype.processFeedbackPopup					= function(){
		var oScope			= this,
			oFeedback		= this.getFeedback(),
			sFeedbackTitle	= oFeedback.getTitle(),
			sFeedback		= oFeedback.getContent(),
			e				= {
				target				: oScope,
			    callBack		: oScope.checkAndResetOptions,
				defaultPrevented 	: false
			};

		this.dispatchEvent('BEFORE_ACTIVITY_ATTEMPT_UPDATE', e);

		// ** If the Event is Prevented to do the Default functionality by the Page Class then return
		if (e.defaultPrevented) {return;}

	    if (this.oDataModel.isShowFeedbackPopup()) {
	        this.openFeedbackPopup(sFeedbackTitle, sFeedback);
	    }else {
	        this.checkAndResetOptions();
	    }
	};
*/

	MultipleDropdownGroup.prototype._evaluate							= function(){
		//Logger.logDebug("MultipleDropdownGroup._evaluate() | sTrigger = "+ sTrigger);
		//Set UI for Tick cross
		//this.oDataModel.setMaxPossibleScore(this.nMaxPossibleScore);


		this.disableActivity();
		this.enableSubmit(false);
		this.oDataModel.updateAttempNumber();
		this.updateScoreAndUserSelections();



	};

	MultipleDropdownGroup.prototype.updateScoreAndUserSelections		= function(){
		Logger.logDebug("MultipleDropdownGroup.updateScoreAndUserSelections() | ");
		var sfbType				= this.oDataModel.getFeedbackType().toUpperCase(),
			oUserSelections		= {},
			sStoredDDGroupID;

		for(var i=0;i<this.aDDList.length;i++){
			var oDropdown			= this.aDDList[i],
				sSelectedOptionID	= oDropdown.getSelectedOption(),

				sCurrDDGroupID		= oDropdown.getGroupID(),
				sDropdownGroupsID	= sCurrDDGroupID.replace(/MultipleDropdownGroup_/i,"").split("_"),

				sOptionGroupsIndex	= Number(sDropdownGroupsID[0]),
				sOptionGroupID		= sDropdownGroupsID[1],

		 		bHasSameGroupID		= this.hasSameGroupID((sStoredDDGroupID || ''), sCurrDDGroupID),
		 		//aUserSelections		= [oDropdown.getSelectedOption(), oDropdown.getGroupID()],
				score				= (sfbType == "PARAMETERBASEDFEEDBACK") ? oDropdown.getParameters() : oDropdown.getScore();

			//Logger.logDebug('\tI = '+i+' : Curr DD Group ID = '+sCurrDDGroupID+' : Selected Option ID = '+sSelectedOptionID+' : Has Same Group ID = '+bHasSameGroupID);
	 		if(!oUserSelections.selectedOptionIDs){
	 			//Logger.logDebug("\tCreating New Selected Option ID's array");
	 			oUserSelections.groupIDIndex		= sOptionGroupsIndex;
	 			oUserSelections.dropDownIDs			= [];
	 			oUserSelections.selectedOptionIDs	= [];
	 		}
	 		if(!sStoredDDGroupID || bHasSameGroupID){
	 			//Logger.logDebug("\t\tAdding Option ID "+sSelectedOptionID+" to array");
		 		oUserSelections.dropDownIDs.push(sOptionGroupID);
	 			oUserSelections.selectedOptionIDs.push(sSelectedOptionID);
	 		}
			this.oDataModel.updateScore(score);
			this.oDataModel.updateUserScores(score);

			if(!sStoredDDGroupID){bHasSameGroupID = true;}
			sStoredDDGroupID		= sCurrDDGroupID;
			if(bHasSameGroupID){continue;}

			//Logger.logDebug("\t\t"+JSON.stringify(oUserSelections));
			//ComponentAbstract.prototype.updateScoreAndUserSelections.call(this, score, oUserSelections);
			this.oDataModel.updateUserSelections(oUserSelections);
			nIndexCount			= 0;
			var oUserSelections		= {
				groupIDIndex				: sOptionGroupsIndex,
				dropDownIDs			: [sOptionGroupID],
				selectedOptionIDs	: [sSelectedOptionID]
			};
		}
		this.oDataModel.updateUserSelections(oUserSelections);
		//ComponentAbstract.prototype.updateScoreAndUserSelections.call(this, score, oUserSelections);
		//Logger.logDebug("\t\t"+JSON.stringify(oUserSelections));
		//Logger.logDebug("MultipleDropdownGroup.updateScoreAndUserSelections() | "+aUserSelections);

		var oScope			= this,
			oEvent			= {
				type			: 'SCORE_UPDATE',
				target			: oScope,
				preventDefault	: false,
				callback		: oScope.updateHistory,
				args			: []
			};

		this.dispatchEvent('SCORE_UPDATE', oEvent);
		if(!oEvent.preventDefault){this.updateHistory();}
	};

	MultipleDropdownGroup.prototype.updateHistory						= function(){
		this.oDataModel.getFeedback(true);
		var oScope	= this,
			oEvent	= {
				type			: 'HISTORY_UPDATE',
				target			: oScope,
				preventDefault	: false,
				callback		: oScope.processFeedbackPopup,
				args			: []
			};

		this.dispatchEvent('HISTORY_UPDATE', oEvent);
		if(!oEvent.preventDefault){this.processFeedbackPopup();}
	};





	MultipleDropdownGroup.prototype.processFeedbackPopup					= function(){
				var oScope			= this,
			oFeedback		= this.getFeedback(),
			sFeedbackTitle	= oFeedback.getTitle(),
			sFeedback		= oFeedback.getContent(),
		 	oTransitionPopup,
			oEvent = {
				target				: oScope,
				popup				: oTransitionPopup
			};


		if(this.oDataModel.isShowFeedbackPopup()){
			oTransitionPopup		= this.openPopup('popup_close', sFeedbackTitle, sFeedback, $('.btn-submit'));
			oTransitionPopup.setCallback(this, this.checkAndResetOptions);

		}else{
			this.checkAndResetOptions();
		}
		this.dispatchEvent('AFTER_ACTIVITY_POPUP', oEvent);
	    //this.checkAndResetOptions();


	};


	MultipleDropdownGroup.prototype.setTickCrossUI				=function(){
		if(this.oDataModel.displayTickCross()){
			for(var i=0;i<this.aDDList.length;i++){
				var oDropdown						= this.aDDList[i],
				sfbType								= this.oDataModel.getFeedbackType().toUpperCase(),
				score								= (sfbType == "PARAMETERBASEDFEEDBACK") ? oDropdown.getParameters() : oDropdown.getScore();
				sTextForTickCross 					= parseInt(score)>0?"correct":"incorrect";

				oDropdown.$domOption.prev().addClass(sTextForTickCross);
				oDropdown.$domOption.next().addClass(sTextForTickCross);
			}
		}
	};

	MultipleDropdownGroup.prototype.openFeedbackPopup			= function(sFeedbackTitle,sFeedback){
		var oTransitionPopup	= this.openPopup('popup_close',sFeedbackTitle,sFeedback,$('.btn-submit'));
			oTransitionPopup.setCallback(this,this.checkAndResetOptions);
	};

	MultipleDropdownGroup.prototype.disable						= function(p_optionID){
		for(var i=0; i<this.aDDList.length; i++){
			var oDD = this.aDDList[i];
			oDD.enable(false);
		}
		this.enableSubmit(false);
	};

	MultipleDropdownGroup.prototype.checkAndResetOptions			= function(e){
		if (this.isAttemptsCompleted()) {
			this.disableActivity();
			this.setTickCrossUI();
			this._activityCompleted();
	    }else{
	        this.resetOptions();
	        this.resetScore();
	        //this.updateAttempNumber();
	    }
	};

	MultipleDropdownGroup.prototype.disableActivity				= function(){
		//Logger.logDebug('MultipleDropdownGroup.disableActivity'+ this.aDDList.length);
		for(var i=0; i<this.aDDList.length; i++){
			var oDD = this.aDDList[i];

			oDD.enable(false);
			oDD.removeEventListener('OPTION_SELECT', this.DDhandleEvents);
		}

		this.enableSubmit(false);
	};

	MultipleDropdownGroup.prototype.updateModelScore			= function(p_nUserScore, p_aUserScore, p_aUserSelections){
		this.oDataModel.setScore(p_nUserScore);
		this.oDataModel.setUserScores(p_aUserScore);
		this.oDataModel.setUserSelections(p_aUserSelections);
	};


	MultipleDropdownGroup.prototype.resetOptions				= function(){
			//console.log("resetOptions" + this.aDDList.length);
		//Logger.logDebug('Nehal MultipleDropdownGroup.resetOptions() | ');
		for(var i=0; i<this.aDDList.length; i++){
			var oMCQ = this.aDDList[i];
			oMultipleDropdownGroup.reset();
		}
		//this.aDDList = [];
		this.enableSubmit(false);
	};

	MultipleDropdownGroup.prototype.enableSubmit				= function(p_bEnable){
		if(p_bEnable) {
			this.$btnSubmit.removeClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled'	: false
				/* END - ARIA Implementation */
			});
		}else{
			this.$btnSubmit.addClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled'	: true
				/* END - ARIA Implementation */
			});
		}
	};

	MultipleDropdownGroup.prototype._hasOptionStatement			= function($domOptnStmnt, sStmntClass, i, sOptnGrpClass){
		if($domOptnStmnt.length == 0){Logger.logError('MultipleDropdownGroup._populateLayout() | No element with class "'+sStmntClass+'" found in the element number "'+(i+1)+'" having class "'+sOptnGrpClass+'"');}
		if($domOptnStmnt.length > 1){Logger.logError('MultipleDropdownGroup._populateLayout() | More than 1 element with class "'+sStmntClass+'" found in the element number "'+(i+1)+'" having class "'+sOptnGrpClass+'"');}
	};

	MultipleDropdownGroup.prototype._hasOptionContainer			= function($domOptn, sOptnClass, i, sOptnGrpClass){
		if($domOptn.length == 0){Logger.logError('MultipleDropdownGroup._populateLayout() | No element with class "'+sOptnClass+'" found in the element number "'+(i+1)+'" having class "'+sOptnGrpClass+'"');}
		if($domOptn.length > 1){Logger.logError('MultipleDropdownGroup._populateLayout() | More than 1 element with class "'+sOptnClass+'" found in the element number "'+(i+1)+'" having class "'+sOptnGrpClass+'"');}
	};

	MultipleDropdownGroup.prototype._hasOptionGroupCotainer		= function($domOptnGrpsCntnr, sOptnGrpsCntnrClass, sQuestionID){
		if($domOptnGrpsCntnr.length == 0){Logger.logError('MultipleDropdownGroup._populateLayout() | No element with class "'+sOptnGrpsCntnrClass+'" found in element "'+sQuestionID+'"');}
		if($domOptnGrpsCntnr.length > 1){Logger.logError('MultipleDropdownGroup._populateLayout() | More than 1 element with class "'+sOptnGrpsCntnrClass+'" found in element "'+sQuestionID+'"');}
	};

	MultipleDropdownGroup.prototype.hasSameGroupID				= function(p_sDropdownGroupID1, p_sDropdownGroupID2){
		var sDropdownGroupsID1	= p_sDropdownGroupID1.replace(/MultipleDropdownGroup_/i,"").split("_")[0],
			sDropdownGroupsID2	= p_sDropdownGroupID2.replace(/MultipleDropdownGroup_/i,"").split("_")[0];
		//Logger.logDebug('MultipleDropdownGroup.hasSameGroupID() | sDropdownGroupsID1 = '+sDropdownGroupsID1+' : sDropdownGroupsID2 = '+sDropdownGroupsID2);
		return (sDropdownGroupsID1 === sDropdownGroupsID2);
	};

	MultipleDropdownGroup.prototype.destroy						= function($domOptnGrpsCntnr, sOptnGrpsCntnrClass, sQuestionID){
		var oScope = this;
		this.$btnSubmit.off();
		this.nMaxPossibleScore = null;
		this.nTabIndex=null;
	};

	MultipleDropdownGroup.prototype.toString 					= function(){
		return 'framework/activity/MultipleDropdownGroup';
	};

	return MultipleDropdownGroup;
});
