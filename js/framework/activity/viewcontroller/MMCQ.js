define([
    'jquery',
    'framework/utils/globals',
    'framework/activity/viewcontroller/ActivityAbstract',
    'framework/activity/MultipleSelectGroup',
    'framework/model/CourseConfigModel',
    'framework/activity/model/MMCQModel',
    'framework/activity/viewcontroller/Option',
    'framework/utils/ResourceLoader',
    'framework/core/PopupManager', 
    'framework/utils/Logger'
], function($, Globals, ComponentAbstract, MultipleSelectGroup, CourseConfig, MMCQModel, Option, ResourceLoader, PopupManager, Logger) {

    function MMCQ() {
        //Logger.logDebug('MMCQ.CONSTRUCTOR() ');
        ComponentAbstract.call(this);

        this.aMMCQList = [];
        this.domTemplate = null;
        this.bFirstTime = true;
        this.currentSetID = null;
        this.$domOptnGrpsCntnr = null;
        this.$btnSubmit = null;
        this.$btnReset = null;
        this.sOptnGrpsCntnrClass = "";
        this.sOptionCls = "";
        this.sOptnTypeCls = "";
        this.sOptionLabelCls = "";
        this.sQuestionCls = "";
        this.sStatementCls = "";
        this.nMaxPossibleScore = 0;
        this.oSelectedToggleGrp = {};
        this.nMaxPossibleSelection;
        this.MMCQhandleEvents = this._handleEvents.bind(this);

        //Logger.logDebug('MMCQ.CONSTRUCTOR() ');
        return this;
    }

    MMCQ.prototype = Object.create(ComponentAbstract.prototype);
    MMCQ.prototype.constructor = MMCQ;
    MMCQ.prototype.init = function(p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation) {
        //Logger.logDebug('MMCQ.init() | '+p_$domView);
        // ** Calling Super Class "init()" function
        //ComponentAbstract.prototype.init.call(this, p_xmlActivityNode, p_$domView);
        $xmlActivity = p_$xmlActivityNode;
        ComponentAbstract.prototype.init.call(this, p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation);

    };



    MMCQ.prototype._createDataModel = function(p_xmlActivityNode) {

        //Logger.logDebug('MMCQ._createDataModel() | '/*+JSON.stringify(p_xmlActivityNode)*/);
        this.oDataModel = new MMCQModel(p_xmlActivityNode, this.sGUID, this.sScoringUID);
        /*** Listener to the DATA MODEL can be added here to listen to Model updates ***/
        /*var oScope = this;
         this.oDataModel.addEventListener('UPDATE', function(e){
         oScope.handleModelUpdates(e);
         });*/
    };

    MMCQ.prototype._populateLayout = function(sExpressionID, sTrigger) {
        //Logger.logDebug('MMCQ.populateLayout() | ');
        var oScope = this,
                oCurrentSet = this.oDataModel.getOptionGroup(),
                aOptions = oCurrentSet.option,
                $domOptnGrpList = null,
                aOptionsList = [],
                sQuestionID = this.oDataModel.getQuestionID();

        //This is done only once as the
        this.sOptnGrpsCntnrClass 	= this.oDataModel.getConfig('class');
       	this.nMaxPossibleSelection 	= this.oDataModel.getConfig('maxSelection')? parseInt(this.oDataModel.getConfig('maxSelection')) : null;
        var domMMCQTable = this.$domView.find("." + this.sOptnGrpsCntnrClass);
        if (this.domTemplate == null) {
            this.$domOptnGrpsCntnr = this.getElementByClassName(this.$domView, this.sOptnGrpsCntnrClass);
            //picks up element from dom with same class name as that of the first option in the current set
            this.domTemplate = this.getElementByClassName(domMMCQTable, oCurrentSet._class);
        }
        /* START - ARIA Implementation */
        this.$domView.attr({
            'role': 'application',
            'tabindex': -1
        });

        // ** Check to make sure that an element with the specified Question ID exists in the DOM
        this._hasQuestionContainer(this, this.$domView, sQuestionID);

		this.initSubmitBtn();
		this.initResetBtn();

        this.enableSubmit(false);
		this.enableReset(false);
		
		this.initShowAnswerBtn();


        //Method renamed from show response to question and scenario as needed for MMCQ- Bharat
        // ** (Vincent) - Commented the call below as it threw an error if the XML <pageText> node for iText and Question is moved into the activity <pageTexts> node
        //oScope._setScenarioAndQuestion();
        this._populateOptionText();
        //Since MMCQ has only 1 element of UI present in its HTML, We need to replecate the UI depending on the number of options in the current Set
        //this._populateOptionText();
        // ** MMCQ activity loaded
        this.bLoaded = true;
        this.dispatchEvent("ACTIVITY_LOADED", {target: this, type: 'ACTIVITY_LOADED', GUID: this.sGUID, eventID: this.sEventID, incidentID: this.sIncidentID});
    };


    /**
     * Update UI with Response Text
     * show Continue button if available
     * Update expression
     */
    MMCQ.prototype._setScenarioAndQuestion = function() {
        //Logger.logDebug('MMCQ._setScenarioAndQuestion() ');
        var oCurrentSet = this.oDataModel.getOptionGroup(),
                arrPageText = [],
                $domContainer = "",
                domMMCQTable = this.$domView.find("." + this.sOptnGrpsCntnrClass),
                PageText = this.oDataModel.getPageTexts();
        if (PageText.length > 0) {
            arrPageText = PageText;
        }
        else {
            arrPageText = [PageText];
        }
        for (var i = 0; i < arrPageText.length; i++) {
            $domContainer = this.getElementByClassName(this.$domView, arrPageText[i]._class);
            $domContainer.html(arrPageText[i].__cdata);
            $domContainer.attr("aria-hidden", "false");
        }
    };

    MMCQ.prototype._populateOptionText = function() {

        //Logger.logDebug("_populateOptionText : ");
        var oCurrentSet = this.oDataModel.getOptionGroup(),
                aOptions = oCurrentSet.option,
                sStatementID = '',
                $domOptnGrpList = null,
                //nMaxPossibleScore	= this.oDataModel.getMaxPossibleScore(),
                aOptionsList = [],
                domMMCQTable = this.$domView.find("." + this.sOptnGrpsCntnrClass),
                $domOptnGrpsCntnr = this.getElementByClassName(this.$domView, this.sOptnGrpsCntnrClass);



        var nNumOfOptions = aOptions.length;
        domMMCQTable.find("." + oCurrentSet._class).remove();
        //shuffle the options if randomization is true
        if (typeof this.oDataModel.oDataModel._randomization != "undefined" && this.oDataModel.oDataModel._randomization == "true")
        {
            for (var j, x, i = aOptions.length; i; j = Math.floor(Math.random() * i), x = aOptions[--i], aOptions[i] = aOptions[j], aOptions[j] = x)
                ;

        }
        
        for (var i = 0; i < nNumOfOptions; i++) {
            //clone and append the template row from the html
            if (this.domTemplate != null) {
                domMMCQTable.append(this.domTemplate.clone().attr({
                    'role': 'checkbox',
                    'aria-labelledby': sStatementID,
                    'title': "Option " + (i + 1)
                }));
            }
        }
        ;


        // ** Iterarating within the Option Nodes
        for (var i = 0; i < nNumOfOptions; i++) {
            var oOption = aOptions[i],
                    sOptnID = oOption._id,
                    $domOptnList = null,
                    nMaxScore = 0,
                    nNextSetID = oOption._jumpGroupID,
                    sStatementID = 'checkboxgroup_' + (i + 1) + '_label',
                    nOptnScore = Number(oOption._score),
                    aOptnParameters = oOption.PARAMETER || null,
                    sImmediateFeedBack = oOption.feedback.content.__cdata,
                    sImmediateFeedBackTitle = oOption.feedback.title.__cdata,
                    sOptnLblTxt = oOption.pageText.__cdata,
                    nMaxScore = Math.max(nMaxScore, nOptnScore);

            // TODO: The if block below can be removed as its not used. Need to check any dependencies and remove it.
            if (!$domOptnGrpList) {
                $domOptnGrpList = this.getElementByClassName($domOptnGrpsCntnr, oCurrentSet.option[0]._class);
                //Logger.logDebug('############ '+$domOptnGrpsCntnr+' : '+this.sOptnTypeCls);
                // ** Check if the number of XML nodes for Radio Containers are Equal to the Number of Radio Containers in the DOM
                ////Logger.logDebug('aOptions.length = '+ aOptions.length+" | $domOptnGrpList.length = "+$domOptnGrpList.length);
                if (aOptions.length != $domOptnGrpList.length) {
                    Logger.logError('MMCQ._populateLayout() | Number of Radio Containers in the XML dont Match with the DOM');
                }
            }

            $domOptnGrpPointer = $($domOptnGrpList[i]);
            var $domOptnStmnt = this.getElementByClassName($domOptnGrpPointer, oCurrentSet.option[0].pageText._class);
            this._hasOptionStatement($domOptnStmnt, oCurrentSet.option[0].pageText._class, i, oCurrentSet.option[0]._class);
            $domOptnStmnt.html(sOptnLblTxt).attr('id', sStatementID);

            // ** Iterarating within the Option node for its text and parameters
            //iterating not needed here
            var nTabIndex = (i === 0) ? 0 : -1;
            /* START - ARIA Implementation */
            $domOptnGrpPointer.attr({
                'id': 'checkbox_' + sOptnID,
                'role': 'checkboxgroup',
                'aria-labelledby': sStatementID,
                'data-index': String(i),
                'aria-checked': 'false',
                'role'						: 'checkbox',
                        'tabindex': 0,
                'aria-posinset': (i + 1),
                'aria-setsize': nNumOfOptions
            });
            /* END - ARIA Implementation */
            $domOptnGrpPointer.find('.checkbox-icon').attr('role', 'presentation');
            /* END - ARIA Implementation */

            //feedback can contain any properties
            var oOptionData = {
                sOptionText: sOptnLblTxt,
                sImmediateFB: sImmediateFeedBack,
                sImmediateFBTitle: sImmediateFeedBackTitle,
            };

            if (this.oDataModel.displayTickCross()) {
                var sTextForTickCross = parseInt(nOptnScore) > 0 ? "correct" : "incorrect";
                $domOptnGrpPointer.addClass(sTextForTickCross);
            }

            ////Logger.logDebug('MMCQ._populateLayout() | DOM Radio '+domOptn+' : ID = '+sOptnID+' : Group ID = '+sOptnGrpID+' : Score = '+nOptnScore+' Params = '+aOptnParameters);
            var oOptn = new Option($domOptnGrpPointer, sOptnID, "1", nOptnScore, aOptnParameters, oOptionData);
            aOptionsList.push(oOptn);
            $domOptnStmnt.on('click', function(e) {
                e.preventDefault();
            });
            this.nMaxPossibleScore += Math.max(nMaxScore,  0);
        } 
        this.oDataModel.setMaxPossibleScore(this.nMaxPossibleScore);
        this.createToggleOptions(aOptionsList);

        $domOptnGrpList = null;
        aOptionsList = null;
        domMMCQTable = null;
        $domOptnGrpsCntnr = null;
    };

    MMCQ.prototype.createToggleOptions = function(p_aOptionsList) {
        oMMCQToggleGrp = new MultipleSelectGroup(p_aOptionsList);
        oMMCQToggleGrp.addEventListener('OPTION_SELECT', this.MMCQhandleEvents);
        this.aMMCQList.push(oMMCQToggleGrp);
        this.oSelectedToggleGrp = oMMCQToggleGrp;
        //Logger.logDebug("createToggleOptions() this.aMMCQList : "+this.aMMCQList);
    };

    MMCQ.prototype._handleEvents = function(e) {
        //Logger.logDebug("handleEvents : "+ e.type);
        if (typeof e.preventDefault == 'function') {
            e.preventDefault();
        }
        var oScope = this,
                target = e.target,
                oOption = e.option,
                currentTarget = e.currentTarget,
                oEvent,
                type = e.type;
        //Logger.logDebug('\tCurrent Target = '+target+' : Type = '+type);
        switch (type) {
            case 'OPTION_SELECT':
                oEvent = $.extend({}, e, {oScope: oScope, target: this, toggleGroup: target});
                this.dispatchEvent('OPTION_SELECT', oEvent);
                this._checkAndEnableSubmit();
				this.checkMaxSelection();
	            break;

            case 'SUBMIT':
                oEvent = $.extend({}, e, {oScope: oScope, target: this, toggleGroup: target});
                this._evaluate('SUBMIT');
                this.dispatchEvent('SUBMIT', oEvent);
                break;
            case 'SHOW_ANSWER' :
				this.showAnswer();
				this.$btnUserAns.removeClass('hide');
				this.$btnShowAns.addClass('hide');
				break;
			case 'SHOW_USER_ANSWER' :					
				this.showAnswer(true);
				this.$btnUserAns.addClass('hide');
				this.$btnShowAns.removeClass('hide');
				this.dispatchEvent(type, oEvent);
				break;
			case 'RESET_ANSWER' :					
				this.reset();
				break;
        }
    };

	/** disabled unchecked options on max possible selection */
    MMCQ.prototype.checkMaxSelection		 = function() {
    	if(!this.nMaxPossibleSelection) return;
    	var nCurrentCount = this.aMMCQList[0].getSelectedOptions().length, i; 

        var flag = (nCurrentCount >= this.nMaxPossibleSelection);
     	 this.aMMCQList[0].enableUnSelected(!flag);
    };
    MMCQ.prototype._checkAndEnableSubmit = function(p_optionID) {
        for (var i = 0; i < this.aMMCQList.length; i++) {
            var oMMCQToggleGrp = this.aMMCQList[i];
            var len = oMMCQToggleGrp.getSelectedOptions().length; 
            //Logger.logDebug("checkAndEnableSubmit() oMMCQToggleGrp.getSelectedOptions() " + oMMCQToggleGrp.getSelectedOptions());
            if (len == 0) {
                this.enableSubmit(false);
                this.enableReset(false);
                return;
            }
        }
        this.enableReset(true);
        this.enableSubmit(true);
    };

    MMCQ.prototype._evaluate = function() {
        //Logger.logDebug("MCQ._evaluate() | sTrigger = "+ sTrigger);

        this.disableActivity();
		 this.enableReset(false);
        var oMCQToggleGrp = this.oSelectedToggleGrp,
		aSelectedOption = oMCQToggleGrp.getSelectedOptions();
        this.enableSubmit(false);
        this.oDataModel.updateAttempNumber();
        this.updateScoreAndUserSelections(aSelectedOption);
        ComponentAbstract.prototype._evaluate.call(this);
    };

    MMCQ.prototype.updateScoreAndUserSelections = function(aSelectedOption) {
        //Logger.logDebug("MMCQ.updateScoreAndUserSelections() | "+aSelectedOption);
        var sfbType = this.oDataModel.getFeedbackType().toUpperCase(),
                aUserSelections = [],
                nScore = 0;
        for (var i = 0; i < aSelectedOption.length; i++) {
            var oSelectedOption = aSelectedOption[i],
                    oUserSelections = {
                        optionGroupID: oSelectedOption.getGroupID(),
                        optionID: oSelectedOption.getID()
                    },
            score = (sfbType == "PARAMETERBASEDFEEDBACK") ? oSelectedOption.getParameters() : oSelectedOption.getScore();

            ComponentAbstract.prototype.updateScoreAndUserSelections.call(this, score, oUserSelections);
        }
        //this.oDataModel.setMaxPossibleScore(this.nMaxPossibleScore);
        oEvent = {
            type: 'SCORE_UPDATE',
            target: this,
            preventDefault: false,
            callback: this.updateHistory,
            args: [oUserSelections]
        };
        this.dispatchEvent('SCORE_UPDATE', oEvent);
        if (!oEvent.preventDefault) {
            this.updateHistory(oUserSelections);
        }
    };

    MMCQ.prototype.updateHistory = function(p_oUserSelections) {
        //Logger.logDebug('MMCQ.updateHistory() | '+JSON.stringify(p_oUserSelections));
        for (var i = 0; i < p_oUserSelections.length; i++) {
            this.oDataModel.updateFeedbackHistory(p_oUserSelections[i], i);
        }
        this.oDataModel.getFeedback(true);
        var oEvent = {
            type: 'HISTORY_UPDATE',
            target: this,
            preventDefault: false,
            callback: this.processFeedbackPopup,
            args: []
        };

        this.dispatchEvent('HISTORY_UPDATE', oEvent);
        if (!oEvent.preventDefault) {
            this.processFeedbackPopup();
        }
    };


    MMCQ.prototype.getUserSelectedOptionID = function(p_nToggleGroupIndex) {
        var oToggleGroup = this.aMMCQList[p_nToggleGroupIndex],
                oOption = oToggleGroup.getSelectedOptions(),
                sOptionID = oOption.getID();

        return sOptionID;
    };

    MMCQ.prototype.updateModelScore = function(p_nUserScore, p_aUserScore, p_aUserSelections) {
        this.oDataModel.setScore(p_nUserScore);
        this.oDataModel.setUserScores(p_aUserScore);
        this.oDataModel.setUserSelections(p_aUserSelections);
    };




    MMCQ.prototype.disable = function(p_optionID) {
        //Logger.logDebug('MMCQ.disable() | '+ p_optionID);
        for (var i = 0; i < this.aMMCQList.length; i++) {
            var oMMCQToggleGrp = this.aMMCQList[i];
            oMMCQToggleGrp.enable(false);
        }
        this.enableSubmit(false);
    };

    MMCQ.prototype.disableActivity = function() {
        //Logger.logDebug('MMCQ.disableActivity'+ this.aMMCQList.length);
        for (var i = 0; i < this.aMMCQList.length; i++) {
            var oMMCQToggleGrp = this.aMMCQList[i];
            oMMCQToggleGrp.enable(false);
            //oMMCQToggleGrp.removeEventListener('OPTION_SELECT', this.MMCQhandleEvents);
        }
        this.enableSubmit(false);
    };

    MMCQ.prototype.resetOptions = function() {
        //Logger.logDebug('MMCQ.resetOptions() | '+this);
        for (var i = 0; i < this.aMMCQList.length; i++) {
            var oMMCQToggleGrp = this.aMMCQList[i];
            oMMCQToggleGrp.reset();
            oMMCQToggleGrp.enable(true);
            
        }
        this.getView().find('.display-result').removeClass('correct incorrect');
        this.enableReset(false);
        this.enableSubmit(false);
    };
    
    MMCQ.prototype.setBookmark								= function(){
		var aUserSelections = this.oDataModel.getScore().getUserSelections();
		for( var i = 0;i < aUserSelections.length;i++){
			var oSelection = aUserSelections[i];
			var id 			= oSelection.optionID;
			var group 		= oSelection.optionGroupID;
			
			for( var j = 0;j < this.aMMCQList.length;j++){
				var oToggleGrp = this.aMMCQList[j];
				if(oToggleGrp.sGroupID === group){
					oToggleGrp.setSelectedOption(id);
					break;
				}
				
			}
			
		}
	};
    
	

	
	MMCQ.prototype.popupEventHandler = function(e) {
		var sEventType = e.type, oPopup = e.target, sPopupID = oPopup.getID();
		//Logger.logDebug('PageAbstract.popupEventHandler() | Event Type = '+sEventType+' : Popup ID = '+sPopupID+' : Event Src = '+e.eventSrc);
		if (sEventType === 'POPUP_EVENT' || sEventType === 'POPUP_CLOSE') {
			oPopup.removeEventListener('POPUP_CLOSE', this.popupEventHandler);
			oPopup.removeEventListener('POPUP_EVENT', this.popupEventHandler);
			//if (sEventType === 'POPUP_EVENT') {
			//this.enableReset(true);
			PopupManager.closePopup(sPopupID);
		//}
		}
	};
	
	
	MMCQ.prototype.getOptions = function() {
    	return this.aMMCQList[0].getOptionsList();
    };

    MMCQ.prototype.openFeedbackPopup = function(sFeedbackTitle, sFeedback) {
        var oTransitionPopup = this.openPopup('feedback', sFeedbackTitle, sFeedback, $('.btn-submit'));
        oTransitionPopup.setCallback(this, this.checkAndResetOptions);
    };

    MMCQ.prototype.checkAndResetOptions = function(p_oPopup, p_oArgs) {
        if (this.isAttemptsCompleted()) {
            this.disable();
            this._activityCompleted();
        } else {
              if(this.oDataModel.hasShowAns() || this.oDataModel.hasReset()){
	         	this.enableShowAnswer(true);
	         	this.enableOptions(false);
	            this.enableReset(true);      	         	
            }else{
	           this.resetOptions();           	
            }    
        };
        ComponentAbstract.prototype.checkAndResetOptions.call(this, p_oArgs);
    };

    MMCQ.prototype.isSelectionCorrect = function(p_bEnable) {
        return this.oDataModel.isSelectionCorrect();
    };

    MMCQ.prototype._hasOptionStatement = function($domOptnStmnt, sStmntClass, i, sOptnGrpClass) {
        if ($domOptnStmnt.length == 0) {
            Logger.logError('MMCQ._populateLayout() | No element with class "' + sStmntClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptnGrpClass + '"');
        }
        if ($domOptnStmnt.length > 1) {
            Logger.logError('MMCQ._populateLayout() | More than 1 element with class "' + sStmntClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptnGrpClass + '"');
        }
    };

    MMCQ.prototype._hasOptionLabel = function($domOptnLbl, sOptnLblClass, j, i) {
        if ($domOptnLbl.length == 0) {
            Logger.logError('MMCQ._populateLayout() | No element with class "' + sOptnLblClass + '" found for Radio Number "' + (j + 1) + '" in Radio Container "' + (i + 1) + '"');
        }
        if ($domOptnLbl.length > 1) {
            Logger.logError('MMCQ._populateLayout() | More than 1 element with class "' + sOptnLblClass + '" found for Radio Number "' + (j + 1) + '" in Radio Container "' + (i + 1) + '"');
        }
    };

    MMCQ.prototype._hasOptionGroupCotainer = function($domOptnGrpsCntnr, sOptnGrpsCntnrClass, sQuestionID) {
        if ($domOptnGrpsCntnr.length == 0) {
            Logger.logError('MMCQ._populateLayout() | No element with class "' + sOptnGrpsCntnrClass + '" found in element "' + sQuestionID + '"');
        }
        if ($domOptnGrpsCntnr.length > 1) {
            Logger.logError('MMCQ._populateLayout() | More than 1 element with class "' + sOptnGrpsCntnrClass + '" found in element "' + sQuestionID + '"');
        }
    };
    
    MMCQ.prototype.enableOptions = function(p_flag) {
		 for (var i = 0; i < this.aMMCQList.length; i++) {
	        var mmGrp = this.aMMCQList[i];
	        mmGrp.enable(p_flag);
	    }
    };
	
	
	 
    MMCQ.prototype.getOptionByID = function(p_ID) {
    	var aOptions = this.getOptions();
    	for (var i=0; i < aOptions.length; i++) {
		  if(aOptions[i].getID() == p_ID){
		  	return aOptions[i]; 
		  }
		};
		
		return null;
    };
	
	  MMCQ.prototype.reset = function() {
    	this.resetOptions();
    	this.resetScore();
     	this.enableReset(false);
     	this.resetShowAnswer();
    	this.hideTickCross();
    	this.resetAttemptNumber();
		this.dispatchEvent('RESET_ACTIVITY', {type:'DECISION_COMPLETE', target:this, questionID:this.getQuestionID()});
    };
	
    MMCQ.prototype.destroy = function($domOptnGrpsCntnr, sOptnGrpsCntnrClass, sQuestionID) {
        this.$btnSubmit.off();

        for (var i = 0; i < this.aMMCQList.length; i++) {
            var oMMCQToggleGrp = this.aMMCQList[i];
            oMMCQToggleGrp.destroy();
            oMMCQToggleGrp = null;
        }

        this.aMMCQList = null;
        this.domTemplate = null;
        this.bFirstTime = null;
        this.currentSetID = null;
        this.$domOptnGrpsCntnr = null;
        this.$btnSubmit = null;
        this.sOptnGrpsCntnrClass = null;
        this.sOptionCls = null;
        this.sOptnTypeCls = null;
        this.sOptionLabelCls = null;
        this.sQuestionCls = null;
        this.sStatementCls = null;
        this.nMaxPossibleScore = null;
        this.oSelectedToggleGrp = null;

        ComponentAbstract.prototype.destroy.call(this);
        this.prototype = null;
    };

    MMCQ.prototype.toString = function() {
        return 'framework/activity/MMCQ';
    };

    return MMCQ;
});
