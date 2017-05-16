define([
	'jquery',
	'framework/utils/globals',
	'framework/activity/viewcontroller/ActivityAbstract',
	'framework/activity/ToggleGroup',
	'framework/model/CourseConfigModel',
	'framework/activity/model/BranchingModel',
	'framework/activity/viewcontroller/Option',
	'framework/utils/ResourceLoader',
	'framework/utils/Logger'
], function($, Globals, ComponentAbstract,ToggleGroup, CourseConfig, BranchingModel,Option, ResourceLoader, Logger){

	function Branching(){
		//Logger.logDebug('Branching.CONSTRUCTOR() ');
		ComponentAbstract.call(this);
		this.oIncidentController;
		this.aMCQList 					= [];
		this.domTemplate				= null;
		this.bFirstTime 				= true;
		this.currentSetID 				= null;
		this.$domOptnGrpsCntnr 			= null;
		this.$btnContinue				= null;
		this.$btnSubmit					= null;
		this.sOptnGrpsCntnrClass		= "";
		this.sOptionCls					= "";
		this.sOptnTypeCls				= "";
		this.sOptionLabelCls			= "";
		this.sQuestionCls				= "";
		this.sStatementCls				= "";
		this.nMaxPossibleScore			= 0;
		this.oSelectedToggleGrp			= {};

		this.MCQhandleEvents = this._handleEvents.bind(this);
		//Logger.logDebug('Branching.CONSTRUCTOR() ');
		return this;
	}

	Branching.prototype										= Object.create(ComponentAbstract.prototype);
	Branching.prototype.constructor							= Branching;
	Branching.prototype.init									= function(p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation){
		//Logger.logDebug('Branching.init() | '+p_$domView);
		// ** Calling Super Class "init()" function
		//ComponentAbstract.prototype.init.call(this, p_xmlActivityNode, p_$domView);
		$xmlActivity	= p_$xmlActivityNode;
		ComponentAbstract.prototype.init.call(this, p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation);

	};



	Branching.prototype._createDataModel						= function(p_xmlActivityNode){
		this.oDataModel = new BranchingModel(p_xmlActivityNode,  this.sGUID, this.sScoringUID);		
	};

		
	/*** Model updates Handler to be used if required ***/
	/*Branching.prototype.handleModelUpdates					= function(e){

	};*/

	Branching.prototype._populateLayout						=  function(p_SetID, sExpressionID,sTrigger){
		var oScope			= this,
			oCurrentSet			= this.oDataModel.getBranchingSet(p_SetID),
			aOptions			= oCurrentSet.option,
			//oCurrentSet.sResponseCls			= this.oDataModel.getBranchingResponseCls(oCurrentSet);
			$domOptnGrpList		= null,
			aOptionsList		= []
			;
			this.currentSetID	= oCurrentSet._id;

			this.sOptnGrpsCntnrClass 		= this.oDataModel.getConfig('class');

			//This is done only once as the
			var domBranchingTable=this.$domView.find("."+this.sOptnGrpsCntnrClass);
			if(this.domTemplate==null){
				this.$domOptnGrpsCntnr = this.getElementByClassName(this.$domView, this.sOptnGrpsCntnrClass);
				//picks up element from dom with same class name as that of the first option in the current set\
				this.domTemplate	= this.getElementByClassName(domBranchingTable, oCurrentSet._class);
			}
			/* START - ARIA Implementation */
			this.$domView.attr({
				'role'		: 'application',
				'tabindex'	: -1
			});


		    /*  if activity has CONTINUE button */
		    if(this.oDataModel.hasContinue()){
		    	 this.$btnContinue = this.$domView.find('#'+this.sQuestionID+'_continue.btn-continue');
	    		if(this.$btnContinue.length === 0){
				     Logger.logError('Branching._populateLayout() | ERROR: "Continue" button not found. A button with id "'+this.oDataModel.getQuestionID()+'_continue" and class "btn-continue" needs to exist within the Activity container');
				}

				this.$btnContinue.click(function(e){
					e.preventDefault();
					if(oScope.isBtnActive(this)){
						//Logger.logDebug("Continue button clicked : currentSetID : "+ oScope.currentSetID+" | oScope : "+ oScope);
						e.type = 'CONTINUE';
					 	oScope.enableContinue(false);
						oScope._handleEvents(e);
					 	$(this).hide();
					}
				});
			}
		    this.enableContinue(false);

		// ** Check to make sure that an element with the specified Question ID exists in the DOM
		this._hasQuestionContainer(this, this.$domView, this.oDataModel.getQuestionID());

		this.$btnSubmit = $('#'+this.oDataModel.getQuestionID()+'_submit.btn-submit');
		//Validate Submit button
		if(this.$btnSubmit.length === 0){
			Logger.logError('Branching._populateLayout() | ERROR: "Submit" button not found. A button with id "'+this.dataModel.getQuestionID()+'_submit" and class "btn-submit" needs to exist within the Activity container');
		}

		//Initialize Submit Button
		this.$btnSubmit.click(function(e){
			e.preventDefault();
			if(oScope.isBtnActive(this)){
				e.type = 'SUBMIT';
				oScope._handleEvents(e);
			}
		});
		this.enableSubmit(false);

		// clear Option, and  reset current UI
		//Method renamed from show response to question and scenario as needed for branching- Bharat
		this._setScenarioAndQuestion(this.currentSetID);
		this._populateOptionText();
		//Since Branching has only 1 element of UI present in its HTML, We need to replecate the UI depending on the number of options in the current Set
		//this._populateOptionText();
		// ** Branching activity loaded
		this.bLoaded = true;
		this.dispatchEvent("ACTIVITY_LOADED", {target:this, type:'ACTIVITY_LOADED', GUID:this.sGUID, eventID:this.sEventID, incidentID:this.sIncidentID});
	};


	/**
	 * Update UI with Response Text
	 * show Continue button if available
	 * Update expression
	 */
	Branching.prototype._setScenarioAndQuestion= function(  ){
			var oScope				= this,
			oCurrentSet				= this.oDataModel.getBranchingSet(this.currentSetID),
			//sQuestion				= this.oDataModel.getBranchingQuestion(oCurrentSet),
			//sStatement				= this.oDataModel.getBranchingScenario(oCurrentSet),
			arrPageText				=[],
			$domContainer			="",
			domBranchingTable 	= this.$domView.find("."+oScope.sOptnGrpsCntnrClass);
			if(oCurrentSet.pageText.length>0){
				arrPageText=oCurrentSet.pageText;
			}
			else{
				arrPageText=[oCurrentSet.pageText];
			}
			for(var i=0;i<arrPageText.length;i++){
				$domContainer	= this.getElementByClassName(oScope.$domView, arrPageText[i]._class)	;
				$domContainer.html(arrPageText[i].__cdata);
				$domContainer.attr("aria-hidden","false");
			}


			$btnContinue			="";

			// Show Continue Button is available instead for Showing next options
			//this.currentSetID	= p_SetID;

		// //Logger.logDebug("Reset UI End");
	};

	Branching.prototype._populateOptionText					= function(){
		//Logger.logDebug("_populateOptionText :  p_SetID : "+ this.currentSetID );
		var oScope				= this,
			oCurrentSet			= this.oDataModel.getBranchingSet(this.currentSetID),
			aOptions			= oCurrentSet.option,
			sStatementID		= '',
			$domOptnGrpList		= null,
			//nMaxPossibleScore	= this.oDataModel.getMaxPossibleScore(),
			aOptionsList		= [],
			domBranchingTable	= this.$domView.find("."+oScope.sOptnGrpsCntnrClass),
			$domOptnGrpsCntnr	= this.getElementByClassName(oScope.$domView, oScope.sOptnGrpsCntnrClass);


		//check for leafnode- End of Branching does not need to be loaded in this case
		//check for nodes with one option and no cdata
		/*if(oCurrentSet.OPTIONS.OPTION.__cdata==""){
			oScope.enableSubmit(false);
			oScope.$btnSubmit.off();
			if(oScope.$btnContinue){
				oScope.$btnContinue.off();
			}
			oScope._activityCompleted();
			return;
		}*/

		if(this.currentSetID==""){
			this.enableSubmit(false);
			this.$btnSubmit.off();
			if(this.$btnContinue){
				this.$btnContinue.off();
			}
			this._activityCompleted();
			return;
		}

		var nNumOfOptions	= aOptions.length;
		domBranchingTable.find("."+oCurrentSet._class).remove();
		for(var i=0; i<nNumOfOptions; i++){
			//clone and append the template row from the html
			if(this.domTemplate != null){
				domBranchingTable.append(this.domTemplate.clone().attr({
					'role'						: 'link',
					'aria-labelledby'			: sStatementID,
					'tabindex'					: ""+(i+11),
					'title'						: "Option "+ (i+1)
					/*'aria-activedescendant'		: 'rg1-r4'*/
				}));
			}
		};


		// ** Iterarating within the Option Nodes
		for(var i=0; i<nNumOfOptions; i++){
			var oOption					= aOptions[i],
				sOptnID					= oOption._id,
				$domOptnList			= null,
				nMaxScore				= 0,
				nNextSetID				= oOption._jumpGroupID,
				sStatementID			= 'radiogroup_'+(i+1)+'_label',
				nOptnScore				= Number(oOption._score),
				aOptnParameters		= oOption.parameter,
				sImmediateFeedBack		= oOption.feedback.content.__cdata,
				sImmediateFeedBackTitle	= oOption.feedback.title.__cdata,
				sOptnLblTxt				= oOption.pageText.__cdata,
				nMaxScore 				= Math.max(nMaxScore, nOptnScore);

			// TODO: The if block below can be removed as its not used. Need to check any dependencies and remove it.
			if(!$domOptnGrpList){
				$domOptnGrpList	= this.getElementByClassName($domOptnGrpsCntnr, oCurrentSet.option[0]._class);
				//Logger.logDebug('############ '+$domOptnGrpsCntnr+' : '+oScope.sOptnTypeCls);
				// ** Check if the number of XML nodes for Radio Containers are Equal to the Number of Radio Containers in the DOM
				////Logger.logDebug('aOptions.length = '+ aOptions.length+" | $domOptnGrpList.length = "+$domOptnGrpList.length);
				if(aOptions.length != $domOptnGrpList.length){Logger.logError('Branching._populateLayout() | Number of Radio Containers in the XML dont Match with the DOM');}
			}

			$domOptnGrpPointer = $($domOptnGrpList[i]);
			var $domOptnStmnt	= this.getElementByClassName($domOptnGrpPointer,  oCurrentSet.option[0].pageText._class);
			this._hasOptionStatement($domOptnStmnt, oCurrentSet.option[0].pageText._class, i, oCurrentSet.option[0]._class);
			$domOptnStmnt.html(sOptnLblTxt).attr('id', sStatementID);

			// ** Iterarating within the Option node for its text and parameters
			//iterating not needed here
				var nTabIndex		= (i === 0) ? 0 : -1;
			/* START - ARIA Implementation */
				$domOptnGrpPointer.attr({
					'id'						: 'radio_' +  sOptnID,
					'role'						: 'radiogroup',
					'aria-labelledby'			: sStatementID,
					'data-index'				: String(i),
					'aria-checked'				: 'false',
					'role'						: 'radio',
					'tabindex'					: nTabIndex,
					'aria-posinset'				: (i+1),
				 	'aria-setsize'				: nNumOfOptions
				});
			/* END - ARIA Implementation */
				$domOptnGrpPointer.find('.radio-icon').attr('role', 'presentation');
				/* END - ARIA Implementation */

			//feedback can contain any properties
			var oOptionData = {
				nResponseSetID	: nNextSetID,
				sImmediateFB	: sImmediateFeedBack,
				sImmediateFBTitle	: sImmediateFeedBackTitle,
			};


			if(this.oDataModel.displayTickCross()){
				var sTextForTickCross = parseInt(nOptnScore)>0?"correct":"incorrect";
				$domOptnGrpPointer.find(".correctincorrect").addClass(sTextForTickCross);
			}

			//Logger.logDebug('Branching._populateLayout() | DOM Radio '+domOptn+' : ID = '+sOptnID+' : Group ID = '+sOptnGrpID+' : Score = '+nOptnScore+' Params = '+aOptnParameters);
			var oOptn = new Option($domOptnGrpPointer, sOptnID, this.currentSetID, nOptnScore, aOptnParameters, oOptionData);
			aOptionsList.push(oOptn);
			$domOptnStmnt.on('click', function(e){
				e.preventDefault();
			});
		}
		this.nMaxPossibleScore += nMaxScore;

		this.createToggleOptions(aOptionsList);


	};

	Branching.prototype.createToggleOptions					= function(p_aOptionsList){
		var oScope	= this,
		oMCQToggleGrp	= new ToggleGroup(p_aOptionsList);
		oMCQToggleGrp.addEventListener('OPTION_SELECT', this.MCQhandleEvents);
		this.aMCQList.push(oMCQToggleGrp);
		this.oSelectedToggleGrp = oMCQToggleGrp;
		//Logger.logDebug("createToggleOptions() this.aMCQList : "+this.aMCQList);
	};

	Branching.prototype._handleEvents						= function(e){
		//Logger.logDebug("handleEvents : "+ e.type);
		if(typeof e.preventDefault == 'function'){e.preventDefault();}
		var oScope = this;
		var target			= e.target,
			oOption         = e.option,
			currentTarget	= e.currentTarget,
			oEvent,
			type			= e.type;
		//Logger.logDebug('Branching._handleEvents() | currentSetID = '+oScope.currentSetID+' : Current Target = '+currentTarget+' : Type = '+type);
		switch(type){
			case 'OPTION_SELECT':
			    oEvent = $.extend({}, e, {oScope:oScope, target:this, toggleGroup:target});
			    this.dispatchEvent('OPTION_SELECT', oEvent);
				this._checkAndEnableSubmit();
				break;
			case 'SUBMIT':
			    oEvent = $.extend({}, e, {oScope:oScope, target:this, toggleGroup:target});
				this._evaluate('SUBMIT');
			    this.dispatchEvent('SUBMIT', oEvent);
				break;
			case 'CONTINUE':
			    oEvent = $.extend({}, e, {oScope:oScope, target:this, toggleGroup:target});
			    this._populateOptionText(this.currentSetID);
			    //this._evaluate('CONTINUE');
			    this.dispatchEvent('CONTINUE', oEvent);
				break;
		}
	};

	Branching.prototype._checkAndEnableSubmit				= function(p_optionID){
		for(var i=0; i<this.aMCQList.length; i++){
			var oMCQToggleGrp = this.aMCQList[i];
			//Logger.logDebug("checkAndEnableSubmit() oMCQToggleGrp.getSelectedOption() " + oMCQToggleGrp.getSelectedOption());
			if(!oMCQToggleGrp.getSelectedOption()){
				this.enableSubmit(false);
				return;
			}
		}
		this.enableSubmit(true);
	};
	/**
	 * Upadate Scoore, Set next set ID
	 * Show Imidiate feedback if available
	 */
	Branching.prototype._evaluate							= function(sTrigger){
		//Logger.logDebug("Branching._evaluate() | sTrigger = "+ sTrigger);
		var nNextSetID,
		oMCQToggleGrp						= this.oSelectedToggleGrp,
		oSelectedOption						= oMCQToggleGrp.getSelectedOption(),
		oSelectedOptionData					= oSelectedOption.getOptionData();

		this.enableSubmit(false);
		this.oDataModel.updateAttempNumber();
		this.updateScoreAndUserSelections(oSelectedOption, oSelectedOptionData);

		/*
		if(sfbType == "PARAMETERBASEDFEEDBACK"){
					this.updateScoreAndUserSelections(oSelectedOption.getParameters(), aUserSelections);
				}else{
					//Logger.logDebug('\tOption ID = '+oSelectedOption.getID()+' : Group ID = '+oSelectedOption.getGroupID());
					this.updateScoreAndUserSelections(oSelectedOption.getScore(), aUserSelections);
				}
				this.oDataModel.setMaxPossibleScore(this.nMaxPossibleScore);*/

		//this.oDataModel.getFeedback(true);

		//this.oDataModel.updateFeedbackHistory(aUserSelections);


	};

	Branching.prototype.updateScoreAndUserSelections		= function(oSelectedOption, oSelectedOptionData){
		//Logger.logDebug("Branching.updateScoreAndUserSelections() | "+oSelectedOptionData);

		var sfbType								= this.oDataModel.getFeedbackType().toUpperCase(),
			aUserSelections						= [oSelectedOption.getID(), oSelectedOption.getGroupID()],
			score								= (sfbType == "PARAMETERBASEDFEEDBACK") ? oSelectedOption.getParameters() : oSelectedOption.getScore();

			oScope			= this,
			oEvent			= {
				type			: 'SCORE_UPDATE',
				target			: oScope,
				preventDefault	: false,
				callback		: oScope.updateHistory,
				args			: [oSelectedOption, oSelectedOptionData]
			};

		this.oDataModel.setMaxPossibleScore(this.nMaxPossibleScore);
		ComponentAbstract.prototype.updateScoreAndUserSelections.call(this, score, aUserSelections);

		this.dispatchEvent('SCORE_UPDATE', oEvent);
		if(!oEvent.preventDefault){this.updateHistory(oSelectedOption, oSelectedOptionData);}
	};

	Branching.prototype.updateHistory						= function(oSelectedOption, oSelectedOptionData){
		//Logger.logDebug("Branching.updateHistory() | "+oSelectedOptionData);

		var aUserSelections		= [oSelectedOption.getID(), oSelectedOption.getGroupID()];
		this.oDataModel.updateFeedbackHistory(aUserSelections);

		var oScope	= this,
			oEvent	= {
				type			: 'HISTORY_UPDATE',
				target			: oScope,
				preventDefault	: false,
				callback		: oScope.showFeedback,
				args			: [oSelectedOption, oSelectedOptionData]
			};

		this.dispatchEvent('HISTORY_UPDATE', oEvent);
		if(!oEvent.preventDefault){this.showFeedback(oSelectedOption, oSelectedOptionData);}
	};

	Branching.prototype.showFeedback		= function(oSelectedOption, oSelectedOptionData){
		var oScope				= this,
			sFeedbackTitle		= oSelectedOptionData.sImmediateFBTitle,
			sFeedback			= oSelectedOptionData.sImmediateFB;

		if(this.oDataModel.hasImmediateFeedback() && sFeedback !== '' && sFeedback !== undefined){
			//Logger.logDebug("Activity has Imidiate Feedback")
			var oTransitionPopup		= this.openPopup('popup_close', sFeedbackTitle, sFeedback, $('#ImmediateFeedback_holder')),
				oEvent = {
					target				: oScope,
					popup				: oTransitionPopup
				};

			oTransitionPopup.setCallback(this, this.loadNextSet, [oSelectedOptionData]);

			this.dispatchEvent('FEEDBACK_POPUP_SHOWN', oEvent);
			this.showTickCross();

		}else{
			/*if(this.oDataModel.hasContinue() && oSelectedOptionData.nResponseSetID != ""){
				//Logger.logDebug("\tActivity HAS  Contnue button"+ oSelectedOptionData.nResponseSetID);
				// ** Activity HAS  Contnue button
				this.currentSetID = oSelectedOptionData.nResponseSetID;
				// ** Disable activity if Continue button is available for activity
				this.disableActivity();
				// ** Enable the Continue Button
				this.enableContinue(true);
			}else {
				//Logger.logDebug("\tActivity DOES NOT have Contnue button"+ this.$btnContinue);
				// ** Activity DOES NOT have Contnue button
				this.currentSetID = oSelectedOptionData.nResponseSetID;
				// ** Show response with expression
				this._setScenarioAndQuestion();
				// ** Load the Next Set
				this._populateOptionText();
			}*/

			//Popup reference is sent as null
			this.loadNextSet(null,oSelectedOptionData);
		}


	};

	Branching.prototype.showTickCross			= function(){
		if(this.oDataModel.displayTickCross()){
				this.$domView.find(".correctincorrect").removeClass("hide");
			}
	};

	Branching.prototype.loadNextSet			= function(p_oPopUpRef,oSelectedOptionData){

		// ** Activity DOES NOT have Contnue button
		this.currentSetID = oSelectedOptionData.nResponseSetID;
		// ** Show response with expression
		this._setScenarioAndQuestion();
		// ** Load the Next Set
		this._populateOptionText();
	};

	// ** TODO: Bharat check this with the ID's first before implementation
	Branching.prototype.checkAndResetOptions = function (e) {
	    if (this.isAttemptsCompleted()) {
			this._activityCompleted();
	    }else{
	        this.resetOptions();
	        this.resetScore();
	    }
	};

	Branching.prototype.getUserSelectedOptionID								= function(p_nToggleGroupIndex){
		var oToggleGroup	= this.aMCQList[p_nToggleGroupIndex],
			oOption			= oToggleGroup.getSelectedOption(),
			sOptionID		= oOption.getID();

		return sOptionID;
	};

	Branching.prototype.getResponseAndOptionTextForSet						= function(sSetID, sOptionID){
		return this.oDataModel.getResponseAndOptionTextForSet(sSetID, sOptionID);
	};

	Branching.prototype.getSetByID											= function(sSetID){
		return this.oDataModel.getBranchingSet(sSetID);
	};

	Branching.prototype.getResponseBySet										= function(oSet){
		return this.oDataModel.getBranchingQuestion(oSet);
	};

	Branching.prototype.showSubmit							= function(p_bShow){
		//Logger.logDebug('Branching.showSubmit() | Show = '+p_bShow);
		(p_bShow) ? this.$btnSubmit.removeClass('hide') : this.$btnSubmit.addClass('hide');
	};

	Branching.prototype.showContinue							= function(p_bShow){
		//Logger.logDebug('Branching.showSubmit() | Show = '+p_bShow);
		(p_bShow) ? this.$btnContinue.removeClass('hide') : this.$btnContinue.addClass('hide');
	};
	Branching.prototype.disable								= function(p_optionID){
		//Logger.logDebug('Branching.disable() | '+ p_optionID);
		for(var i=0; i<this.aMCQList.length; i++){
			var oMCQToggleGrp = this.aMCQList[i];
			oMCQToggleGrp.enable(false);
		}
		this.enableSubmit(false);
	};

	Branching.prototype.disableActivity						= function(){
		//Logger.logDebug('Branching.disableActivity'+ this.aMCQList.length);
		for(var i=0; i<this.aMCQList.length; i++){
			var oMCQToggleGrp = this.aMCQList[i];
			oMCQToggleGrp.enable(false);
			oMCQToggleGrp.removeEventListener('OPTION_SELECT', this.MCQhandleEvents);
		}
		this.enableSubmit(false);
	};

	Branching.prototype.resetOptions							= function(){
		//Logger.logDebug('Branching.resetOptions() | '+this);
		for(var i=0; i<this.aMCQList.length; i++){
			var oMCQToggleGrp = this.aMCQList[i];
			oMCQToggleGrp.reset();
		}
		this.enableSubmit(false);
	};

	Branching.prototype.enableSubmit							= function(p_bEnable){
		if(p_bEnable) {
			this.$btnSubmit.removeClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled'	: false
				/* END - ARIA Implementation */
			})/*.show()*/;

		}else{
			this.$btnSubmit.addClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled'	: true
				/* END - ARIA Implementation */
			})/*.hide()*/;
		}
	};

	Branching.prototype.enableContinue						= function(p_bEnable){
		if(!this.oDataModel.hasContinue())return;

		if(p_bEnable) {
			this.$btnContinue.removeClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled'	: false
				/* END - ARIA Implementation */
			});
			this.dispatchEvent('CONTINUE_SHOWN', oEvent);
		}else{
			this.$btnContinue.addClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled'	: true
				/* END - ARIA Implementation */
			});
			this.dispatchEvent('CONTINUE_HIDDEN', oEvent);
		}
	};

	Branching.prototype._hasOptionStatement					= function($domOptnStmnt, sStmntClass, i, sOptnGrpClass){
		if($domOptnStmnt.length == 0){Logger.logError('Branching._populateLayout() | No element with class "'+sStmntClass+'" found in the element number "'+(i+1)+'" having class "'+sOptnGrpClass+'"');}
		if($domOptnStmnt.length > 1){Logger.logError('Branching._populateLayout() | More than 1 element with class "'+sStmntClass+'" found in the element number "'+(i+1)+'" having class "'+sOptnGrpClass+'"');}
	};

	Branching.prototype._hasOptionLabel						= function($domOptnLbl, sOptnLblClass, j, i){
		if($domOptnLbl.length == 0){Logger.logError('Branching._populateLayout() | No element with class "'+sOptnLblClass+'" found for Radio Number "'+(j+1)+'" in Radio Container "'+(i+1)+'"');}
		if($domOptnLbl.length > 1){Logger.logError('Branching._populateLayout() | More than 1 element with class "'+sOptnLblClass+'" found for Radio Number "'+(j+1)+'" in Radio Container "'+(i+1)+'"');}
	};

	Branching.prototype._hasOptionGroupCotainer				= function($domOptnGrpsCntnr, sOptnGrpsCntnrClass, sQuestionID){
		if($domOptnGrpsCntnr.length == 0){Logger.logError('Branching._populateLayout() | No element with class "'+sOptnGrpsCntnrClass+'" found in element "'+sQuestionID+'"');}
		if($domOptnGrpsCntnr.length > 1){Logger.logError('Branching._populateLayout() | More than 1 element with class "'+sOptnGrpsCntnrClass+'" found in element "'+sQuestionID+'"');}
	};

	Branching.prototype.destroy								= function($domOptnGrpsCntnr, sOptnGrpsCntnrClass, sQuestionID){
		this.$btnSubmit.off();
		this.oSelectedToggleGrp=null;
		for(var i=0; i<this.aMCQList.length; i++){
			var oMCQToggleGrp = this.aMCQList[i];
			oMCQToggleGrp.destroy();
		}
	};

	Branching.prototype.toString 							= function(){
		return 'framework/activity/Branching';
	};

	return Branching;
});
