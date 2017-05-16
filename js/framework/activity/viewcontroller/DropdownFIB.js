define(['jquery', 
		'framework/utils/globals', 
		'framework/activity/viewcontroller/ActivityAbstract', 
		'framework/activity/model/DropdownFIBModel', 
		'framework/activity/viewcontroller/Dropdown', 
		'framework/utils/Logger'], 
function($, Globals, ComponentAbstract, DropdownFIBModel, Dropdown, Logger) {

	function DropdownFIB() {
		//Logger.logDebug('DropdownFIB.CONSTRUCTOR() ');
		ComponentAbstract.call(this);
		this.aDDList = [];
		this.inputFieldHandleEvents = this._handleEvents.bind(this);
		return this;
	}


	DropdownFIB.prototype = Object.create(ComponentAbstract.prototype);
	DropdownFIB.prototype.constructor = DropdownFIB;

	DropdownFIB.prototype.init = function(p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation) {
		//Logger.logDebug('DropdownFIB.init() ');
		// ** Calling Super Class "init()" function
		ComponentAbstract.prototype.init.call(this, p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation);
	};

	DropdownFIB.prototype._createDataModel = function(p_xmlActivityNode) {
		this.oDataModel = new DropdownFIBModel(p_xmlActivityNode, this.sGUID, this.sScoringUID);

		/*** Listener to the DATA MODEL can be added here to listen to Model updates ***/
		/*this.oDataModel.addEventListener('UPDATE', function(e){
		 oScope.handleModelUpdates(e);
		 });*/
	};
	/**
	 *Gets the list of selects and the statements and calls the function to replace and set sellects in the statements
	 */
	DropdownFIB.prototype._populateLayout = function() {
		//Logger.logDebug('DropdownFIB._populateLayout() ');
		var oScope = this,
		    sQuestionID = this.oDataModel.getQuestionID(),
		    aOptionGroupContainerList = this.oDataModel.getOptionGroup(),
		    sOptionGroupContainerClass = this.oDataModel.getOptionGroupContainerClass(),
		/*aStatementList					= this.oDataModel.getOptionGroupStatementList(),*/
		    $domActivity = this.getElementByID(this.$domView, sQuestionID),
		    $domOptionGroupContainerList = this.getElementByClassName($domActivity, sOptionGroupContainerClass),
		    nMaxPossibleScore = 0,
		    nSubmitTabIndex;

		// ** Check to make sure that an element with the specified Question ID exists in the DOM
		this._hasQuestionContainer(this, $domActivity, sQuestionID);
		
		this.bHasShowAns	= this.oDataModel.getConfig('hasShowAnswer')? (this.oDataModel.getConfig('hasShowAnswer') == "true") : false;
		this.bHasReset 		= this.oDataModel.getConfig('hasResetBtn')? (this.oDataModel.getConfig('hasResetBtn') == "true") : false;

		/* START - ARIA Implementation */
		$domActivity.attr({
			'role' : 'application',
			'tabindex' : -1
		});
		/* END - ARIA Implementation */

		// ** Check if the number of XML nodes for DropdownFIB Containers are Equal to the Number of DropdownFIB Containers in the DOM
		/*if(nOptionGroupContainerListLength !== nDomOptionGroupConatainersLength){
		Logger.logError('DropdownFIB._populateLayout() | ERROR: Number of "OptionGroupConatainers" in the XML dont Match with the DOM elements having class "'+sOptionGroupContainerClass+'"');
		}*/

		//Logger.logDebug('aOptionGroupContainerList = '+JSON.stringify(aOptionGroupContainerList));
		this._setStatementAndOptionGroups($domActivity, $domOptionGroupContainerList[0], aOptionGroupContainerList);
		nSubmitTabIndex = 2;

		//Logger.logDebug('nMaxPossibleScore = '+this.nMaxPossibleScore);

		var sSubmitID = sQuestionID + '_submit';
		this.$btnSubmit = $('#' + sSubmitID + '.btn-submit');
		this.$btnSubmit.addClass('btn disabled').attr({
			/* START - ARIA Implementation */
			'role' : 'button',
			'tabindex' : nSubmitTabIndex
			/* END - ARIA Implementation */
		}).on('click', function(e) {
			e.preventDefault();
			if (oScope.isBtnActive(this)) {
				e.type = 'SUBMIT';
				oScope._handleEvents(e);
			}
		});
		this.enableSubmit(false);

		this.$btnReset = this.$domView.find('.btn-reset').attr('id', this.getQuestionID() + '_reset');
		this.enableReset(false);
		if (this.oDataModel.oDataModel._hasReset === "true") {
			this.$btnReset.removeClass('hide');
		}
		this.$btnReset.click(function(e) {
			oScope.reset();
		});

		this.$btnShowAns = this.$domView.find('.btn-show-ans');
		if (this.$btnShowAns.length) {
			this.$btnShowAns.addClass('hide');
			this.$btnShowAns.attr('id', this.getQuestionID() + '_showAns');
			if (this.bHasShowAns) {
				this.$btnShowAns.click(function(e) {
					e.preventDefault();
					if (oScope.isBtnActive(this)) {
						e.type = 'SHOW_ANSWER';
						oScope._handleEvents(e);
					}
				});
				this.$btnShowAns.removeClass('hide');
			} else {
				this.$btnShowAns.remove();
			}
		}

		this.$btnUserAns = this.$domView.find('.btn-show-my-ans');
		if (this.$btnUserAns.length) {
			this.$btnUserAns.attr('id', this.getQuestionID() + '_myAns');
			this.$btnUserAns.addClass('hide');
			if (this.bHasShowAns) {
				this.$btnUserAns.click(function(e) {
					e.preventDefault();
					if (oScope.isBtnActive(this)) {
						e.type = 'SHOW_USER_ANSWER';
						oScope._handleEvents(e);
					}
				});
			} else {
				this.$btnUserAns.remove();
			}
		}

		this.bLoaded = true;
		this.dispatchEvent("ACTIVITY_LOADED", {
			target : this,
			type : 'ACTIVITY_LOADED',
			GUID : this.sGUID,
			eventID : this.sEventID,
			incidentID : this.sIncidentID
		});
	};

	/**
	 *Finds <<Select>> in Statement and replaces it with dropdowns
	 */
	DropdownFIB.prototype._setStatementAndOptionGroups = function($domActivity, domOptionGroupContainerPointer, p_oOptionGroupContainerPointer) {
		var oOptionGroupContainerPointer = p_oOptionGroupContainerPointer,
		    $OptionGroupContainerPointer = $(domOptionGroupContainerPointer),
		/* The LI/Div Container */
		    sOptionGroupContainerClass = oOptionGroupContainerPointer._class,
		/* Label Statement Input Field */
		    oOptionGroupStatement = this.oDataModel.getOptionGroupStatement();
		sStmntClass = oOptionGroupStatement._class,
		sStmntTxt = oOptionGroupStatement.__cdata,
		aStmntTxt = this._getStatementArray(sStmntTxt),
		nNumOfInputsInStmnt = aStmntTxt.length - 1,
		/* Input Field Container */
		aOptionGroupList = this.oDataModel.getOptionGroupList(),
		nOptionGroupListLength = (this.isArray(aOptionGroupList)) ? aOptionGroupList.length : 1,
		/* Custom Vars */
		sStatementID = 'DropdownGroup_label',
		sOptionGroupIDFromXml = '',
		nScore = 0,
		j = 0;

		// If the no of <<select>> does not match optionGroup list this throws an error
		if (nOptionGroupListLength !== nNumOfInputsInStmnt) {
			Logger.logError('DropdownFIB._setStatementAndOptionGroups() | ERROR: Number (' + nNumOfInputsInStmnt + ') of Input Fields specified in a "pageText" node doesnt match the number (' + nOptionGroupListLength + ') of "OptionGroup" nodes specified in the XML for "OptionGroupContainer" number "');
		}

		//div instead of p tag , So that ul ol etc can be a part of the statement
		var $statement = nOptionGroupListLength == 1 ? $('<label></label>') : $('<div></div>');
		$statement.attr({
			'id' : sStatementID,
			'class' : sStmntClass,

		});

		//Added earlier so that the dom is available when searched below and dropdown is added to placeholder
		$OptionGroupContainerPointer.prepend($statement);
		//loop through the option group list and replace <<select>>
		//Sequence is followed to pick from optiongroup from list
		for ( j = 0; j < nOptionGroupListLength; j++) {

			var oOptionGroupPointer = aOptionGroupList[j],
			//oInput					= this.oDataModel.getInputField(i, 0),
			//oInputProps				= this._createInputProperties(oOptionGroupPointer, oInput),
			    sOptionGroupID = 'DropdownGroup_' + oOptionGroupPointer._id, //'OptionGroup_' + (j+1),
			    aOptionsList = [],
			    $domOptionGroupField = $('<select/>');

			if (nOptionGroupListLength == 1) {
				oOptionGroupPointer = aOptionGroupList;
			}
			nScore += this.sanitizeValue(oOptionGroupPointer._score, 1);
			$domOptionGroupField.attr({

				'id' : 'OptionGroup_' + sOptionGroupID,
				'class' : 'dropdown'
			});

			//DropDown Values.....
			// ** Iterarating within the Option node for its text and parameters
			for (var k = 0; k < oOptionGroupPointer.option.length; k++) {
				var oOption = oOptionGroupPointer.option[k];
				oOption.sOptnID = oOption._id;
				oOption.sOptnClass = oOption._class;
				oOption.nOptnScore = Number(oOption._score);
				oOption.aOptnParameters = oOption.parameter;
				oOption.sOptnLblClass = oOption.pageText._class;
				oOption.sOptnLblTxt = oOption.pageText.__cdata;
				//nMaxScore 					= Math.max(nMaxScore, oOption.nOptnScore),
				sOptnClass = oOption._class;

				aOptionsList.push(oOption);
			}
			var oTickCrossSpan;
			if (this.oDataModel.displayTickCross()) {

				oTickCrossSpan = $("<span class='btn-sprite correctincorrect display-result'></span>");
			}
			//Append the markup for div
			$statement.append(aStmntTxt[j]).append(oTickCrossSpan, $domOptionGroupField); //.append(aStmntTxt[j + 1]);
			if ( nNumOfInputsInStmnt === j+1)
			{
				$statement.append(aStmntTxt[j + 1])
			}		
			//Add select to the dom
			this.createDropdown($domActivity.find($($domOptionGroupField[0])), sOptionGroupID, aOptionsList);

		}
		this.oDataModel.setMaxPossibleScore(nScore);
		return;
	};

	DropdownFIB.prototype.createDropdown = function(p_domOptn, p_sOptnGrpID, p_aOptionsList) {
		var oScope = this,
		    oDD = new Dropdown(p_domOptn, p_sOptnGrpID, p_aOptionsList);

		oDD.addEventListener('OPTION_SELECT', this.inputFieldHandleEvents);

		this.aDDList.push(oDD);
	};
	DropdownFIB.prototype._getStatementArray = function(p_sStatement) {
		var aPieces = p_sStatement.split('<<SELECT>>');
		return aPieces;
	};

	DropdownFIB.prototype._handleEvents = function(e) {
		if ( typeof e.preventDefault == 'function') {
			e.preventDefault();
		}
		var target = e.target,
		    currentTarget = e.currentTarget,
		    type = e.type;
		//Logger.logDebug('DropdownFIB._handleEvents() | Target = '+ target+' : Type = '+type);

		switch(type) {
		case 'OPTION_SELECT':
			//Logger.logDebug('DropdownFIB._handleEvents() | Input Field ID = '+ target.getID());
			this._dispatchOptionGroupEvent(e);
			this._checkAndEnableSubmit(e);
			break;
		case 'SUBMIT':
			this._dispatchSubmitEvent(e);
			this._evaluate(e);
			break;
         case 'RESET' :
			this.reset();
		break;
		case 'SHOW_ANSWER' :
			this.showCorrectAnswer();
			this.$btnShowAns.addClass('hide');
			this.$btnUserAns.removeClass('hide');
			break;
		case 'SHOW_USER_ANSWER' :
			this.showUserAnswer();
			this.$btnUserAns.addClass('hide');
			this.$btnShowAns.removeClass('hide');
			this.dispatchEvent(type, oEvent);
			break;
		}
	};

	DropdownFIB.prototype._dispatchOptionGroupEvent = function(e) {
		e.inputList = this.getDropdownList();
		this.dispatchEvent(e.type, e);
	};

	DropdownFIB.prototype._dispatchSubmitEvent = function(e) {
		//Logger.logDebug('DropdownFIB._dispatchSubmitEvent() | Default Prevented = '+e.isDefaultPrevented());
		e.type = 'SUBMIT';
		e.target = this;
		e.deafultPrevented = false;
		e.inputList = this.aDDList;
		//e.returnFocusTo			= this.aDDList[0].getInputField();

		this.dispatchEvent('SUBMIT', e);
	};

	DropdownFIB.prototype._checkAndEnableSubmit = function(p_optionID) {
		for (var i = 0; i < this.aDDList.length; i++) {
			var oDD = this.aDDList[i];
			if (!oDD.getSelectedOption()) {
				this.enableSubmit(false);
				return;
			}
		}
		this.enableSubmit(true);
	};

	DropdownFIB.prototype._evaluate = function() {
		//Logger.logDebug("MCQ._evaluate() | sTrigger = "+ sTrigger);
		//this.oDataModel.setMaxPossibleScore(this.nMaxPossibleScore);
		//Set UI for Tick cross

		this.disableActivity();
		this.enableSubmit(false);
		this.enableReset(true);
		this.oDataModel.updateAttempNumber();
		this.updateScoreAndUserSelections();

	};

	DropdownFIB.prototype.updateScoreAndUserSelections = function() {
		//Logger.logDebug("MCQ.updateScoreAndUserSelections() | ");
		var sfbType = this.oDataModel.getFeedbackType().toUpperCase();
		for (var i = 0; i < this.aDDList.length; i++) {
			var oToggleGrp = this.aDDList[i],
			    aUserSelections = [oToggleGrp.getSelectedOption(), oToggleGrp.getGroupID()],
			    score = (sfbType == "PARAMETERBASEDFEEDBACK") ? oToggleGrp.getParameters() : oToggleGrp.getScore();
			ComponentAbstract.prototype.updateScoreAndUserSelections.call(this, score, aUserSelections);
		}

		oScope = this,
		oEvent = {
			type : 'SCORE_UPDATE',
			target : oScope,
			preventDefault : false,
			callback : oScope.updateHistory,
			args : []
		};
		if(this.bHasShowAns){
			this.$btnShowAns.removeClass('disabled');
		}

		this.dispatchEvent('SCORE_UPDATE', oEvent);
		if (!oEvent.preventDefault) {
			this.updateHistory();
		}
	};

	DropdownFIB.prototype.updateHistory = function() {
		this.oDataModel.getFeedback(true);
		var oScope = this,
		    oEvent = {
			type : 'HISTORY_UPDATE',
			target : oScope,
			preventDefault : false,
			callback : oScope.processFeedbackPopup,
			args : []
		};

		this.dispatchEvent('HISTORY_UPDATE', oEvent);
		if (!oEvent.preventDefault) {
			this.processFeedbackPopup();
		}
	};

	DropdownFIB.prototype.processFeedbackPopup = function() {
		var oScope = this,
		    oFeedback = this.getFeedback(),
		    sFeedbackTitle = oFeedback.getTitle(),
		    sFeedback = oFeedback.getContent(),
		    oTransitionPopup,
		    oEvent = {
			target : oScope,
			popup : oTransitionPopup
		};

		if (this.oDataModel.isShowFeedbackPopup()) {
			oTransitionPopup = this.openPopup('popup_close', sFeedbackTitle, sFeedback, $('.btn-submit'));
			oTransitionPopup.setCallback(this, this.checkAndResetOptions);

		} else {
			this.checkAndResetOptions();
		}
		this.dispatchEvent('AFTER_ACTIVITY_POPUP', oEvent);
		//this.checkAndResetOptions();

	};

	DropdownFIB.prototype.setTickCrossUI = function() {
		if (this.oDataModel.displayTickCross()) {
			for (var i = 0; i < this.aDDList.length; i++) {
				var oToggleGrp = this.aDDList[i],
				    sfbType = this.oDataModel.getFeedbackType().toUpperCase(),
				    score = (sfbType == "PARAMETERBASEDFEEDBACK") ? oToggleGrp.getParameters() : oToggleGrp.getScore();
				sTextForTickCross = parseInt(score) > 0 ? "correct" : "incorrect";

				oToggleGrp.$domOption.prev().addClass(sTextForTickCross);
				oToggleGrp.$domOption.next().addClass(sTextForTickCross);
			}
		}
	};

	DropdownFIB.prototype.getDropdownList = function() {
		return this.aDDList;
	};
	
	    DropdownFIB.prototype.displayTickCross = function() { 
        for (var i = 0; i < this.aDDList.length; i++) { 
            var oToggleGrp = this.aDDList[i], 
                    sfbType = this.oDataModel.getFeedbackType().toUpperCase(), 
                    score = (sfbType == "PARAMETERBASEDFEEDBACK") ? oToggleGrp.getParameters() : oToggleGrp.getScore(); 
            sTextForTickCross = parseInt(score) > 0 ? "correct" : "incorrect"; 

            oToggleGrp.$domOption.parent().addClass("display-result " +sTextForTickCross); 
        } 
         
    };

    DropdownFIB.prototype.openFeedbackPopup = function(sFeedbackTitle, sFeedback) { 
        var oTransitionPopup = this.openPopup('feedback', sFeedbackTitle, sFeedback, $('.btn-submit')); 
        oTransitionPopup.setCallback(this, this.checkAndResetOptions); 
    }; 

	DropdownFIB.prototype.updateModelScore = function(p_nUserScore, p_aUserScore, p_aUserSelections) {
		this.oDataModel.setScore(p_nUserScore);
		this.oDataModel.setUserScores(p_aUserScore);
		this.oDataModel.setUserSelections(p_aUserSelections);
	};

	DropdownFIB.prototype.reset = function() {
		this.resetOptions();
		this.resetScore();
		this.resetAttemptNumber();
		this.dispatchEvent('RESET', {
			type : 'RESET',
			target : this
		});
		this.enableReset(false);
	};

	DropdownFIB.prototype.checkAndResetOptions = function(e) {
		if (this.isAttemptsCompleted()) {
			this.disableActivity();
			this.setTickCrossUI();
			this._activityCompleted();
		} else {
			this.resetOptions();
			this.resetScore();
			//this.updateAttempNumber();
		}
	};

	DropdownFIB.prototype.disable = function(p_optionID) {
		//Logger.logDebug('DropdownFIB.disable() | '+p_optionID);
		for (var i = 0; i < this.aDDList.length; i++) {
			var oInputField = this.aDDList[i];
			oInputField.enable(false);
		}
		this.enableSubmit(false);
	};

	DropdownFIB.prototype.disableActivity = function() {
		//Logger.logDebug('DropdownFIB.disableActivity() | ');
		for (var i = 0; i < this.aDDList.length; i++) {
			var oInputField = this.aDDList[i];
			oInputField.enable(false);
			oInputField.removeEventListener('TYPE_IN', this.inputFieldHandleEvents);
			oInputField.removeEventListener('ENTER', this.inputFieldHandleEvents);
		}
		this.enableSubmit(false);
	};

	DropdownFIB.prototype.resetOptions = function() {
		//Logger.logDebug('DropdownFIB.reset() | ');
		for (var i = 0; i < this.aDDList.length; i++) {
			var oInputField = this.aDDList[i];
			oInputField.reset();
		}
		this.getView().find('.display-result').removeClass('correct incorrect');
		this.enableReset(false);
		this.enableSubmit(false);
		this.$btnShowAns.addClass('disabled hide');
		this.$btnUserAns.addClass('hide');
		if (this.bHasShowAns) {
			this.$btnShowAns.removeClass('hide');
		}
	};

	DropdownFIB.prototype.enableSubmit = function(p_bEnable) {
		if (p_bEnable) {
			this.$btnSubmit.removeClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled' : false
				/* END - ARIA Implementation */
			});
		} else {
			this.$btnSubmit.addClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled' : true
				/* END - ARIA Implementation */
			});
		}
	};

	DropdownFIB.prototype.showCorrectAnswer = function(p_bEnable) {
		for (var i = 0; i < this.aDDList.length; i++) {
			this.aDDList[i].showCorrectAnswer();
		};
		this.getView().find('.correctincorrect').addClass('hide');
	};
	DropdownFIB.prototype.showUserAnswer = function(p_bEnable) {
		for (var i = 0; i < this.aDDList.length; i++) {
			this.aDDList[i].showUserAnswer();
		};
		this.getView().find('.correctincorrect').removeClass('hide');
	};

	DropdownFIB.prototype._hasOptionStatement = function($domOptnStmnt, sStmntClass, i, sOptionGroupContainerClass) {
		if ($domOptnStmnt.length == 0) {
			Logger.logError('DropdownFIB._populateLayout() | No element with class "' + sStmntClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptionGroupContainerClass + '"');
		}
		if ($domOptnStmnt.length > 1) {
			Logger.logError('DropdownFIB._populateLayout() | More than 1 element with class "' + sStmntClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptionGroupContainerClass + '"');
		}
	};

	DropdownFIB.prototype._hasInputField = function($domOptn, sOptionGroupClass, i, sOptionGroupContainerClass) {
		if ($domOptn.length == 0) {
			Logger.logError('DropdownFIB._populateLayout() | No element with class "' + sOptionGroupClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptionGroupContainerClass + '"');
		}
		if ($domOptn.length > 1) {
			Logger.logError('DropdownFIB._populateLayout() | More than 1 element with class "' + sOptionGroupClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptionGroupContainerClass + '"');
		}
	};

	DropdownFIB.prototype.destroy = function($domOptionGroupsCntnr, sOptionGroupsCntnrClass, sQuestionID) {
		this.$btnSubmit.off();
		for (var i = 0; i < this.aDDList.length; i++) {
			var oInputField = this.aDDList[i];
			oInputField.removeEventListener('TYPE_IN', this.inputFieldHandleEvents);
			oInputField.removeEventListener('ENTER', this.inputFieldHandleEvents);
			oInputField.destroy();
		}
	};

	DropdownFIB.prototype.isSelectionCorrect = function(p_bEnable) {
		return this.oDataModel.isSelectionCorrect();
	};

	DropdownFIB.prototype.toString = function() {
		return 'framework/activity/DropdownFIB';
	};

	return DropdownFIB;
});
