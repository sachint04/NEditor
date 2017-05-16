'use strict'
/**
 * @export framework/activity/viewcontroller/MCQ 
 */
define([
    'jquery',
    'framework/utils/globals',
    'framework/activity/viewcontroller/ActivityAbstract',
    'framework/activity/ToggleGroup',
    'framework/model/CourseConfigModel',
    'framework/core/AudioManager',
    'framework/activity/model/MCQModel',
    'framework/activity/viewcontroller/Option',
    'framework/utils/ResourceLoader',
    'framework/core/PopupManager', 
    'framework/utils/Logger'
], function($, Globals, ComponentAbstract, ToggleGroup, CourseConfig, AudioManager, MCQModel, Option, ResourceLoader, PopupManager, Logger) {
	
	/**
	 * 
	 * Tutorial:  {@link  http://localhost:8020/LearnX_Mobile-02/01_Version_2.1/index.html?page=cw01~cw01~pg10}
	 * @constructor
	 * @alias MCQ 
	 */
    function MCQ() {
        //Logger.logDebug('MCQ.CONSTRUCTOR() ');
        ComponentAbstract.call(this);
        this.oIncidentController;
        this.aMCQList 				= [];
        this.domTemplate 			= null;
        this.bFirstTime 			= true;
        this.currentSetID 			= null;
        this.$domOptnGrpsCntnr 		= null;
        this.sOptnGrpsCntnrClass 	= "";
        this.sOptionCls 			= "";
        this.sOptnTypeCls 			= "";
        this.sOptionLabelCls 		= "";
        this.sQuestionCls 			= "";
        this.sStatementCls 			= "";
        this.nMaxPossibleScore		= 0;
        this.oSelectedToggleGrp 	= {};
        this.MCQhandleEvents 		= this._handleEvents.bind(this);

        //Logger.logDebug('MCQ.CONSTRUCTOR() ');
        return this;
    }

    MCQ.prototype = Object.create(ComponentAbstract.prototype);
    MCQ.prototype.constructor = MCQ;
    MCQ.prototype.init = function(p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation) {
        //Logger.logDebug('MCQ.init() | '+p_$domView);
        // ** Calling Super Class "init()" function
        //ComponentAbstract.prototype.init.call(this, p_xmlActivityNode, p_$domView);
        ComponentAbstract.prototype.init.call(this, p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation);

    };

    /**
     * Last edited by : Sachin Tumbre
     * date: 12/01/2014
     * Moving activity level logic to 'onModelReady' method
     */
    MCQ.prototype._createDataModel = function(p_xmlActivityNode) {
        this.oDataModel = new MCQModel(p_xmlActivityNode, this.sGUID, this.sScoringUID);
    };

    MCQ.prototype._populateLayout = function(sExpressionID, sTrigger) {
        var oScope 				= this,
            oCurrentSet 		= this.oDataModel.getOptionGroup(),
            aOptions 			= oCurrentSet.option,
            $domOptnGrpList 	= null,
            aOptionsList 		= [];

        //This is done only once as the
        this.sOptnGrpsCntnrClass = this.oDataModel.getConfig('class');
        var domMCQTable = this.$domView.find("." + this.sOptnGrpsCntnrClass);
        //Logger.logDebug('\tsOptnGrpsCntnrClass = '+this.sOptnGrpsCntnrClass);
        if (this.domTemplate == null) {
            this.$domOptnGrpsCntnr = this.getElementByClassName(this.$domView, this.sOptnGrpsCntnrClass);
            //picks up element from dom with same class name as that of the first option in the current set\
            this.domTemplate = this.getElementByClassName(domMCQTable, oCurrentSet._class);
        }
        /* START - ARIA Implementation */
        this.$domView.attr({
            'role': 'application',
            'tabindex': -1
        });

        // ** Check to make sure that an element with the specified Question ID exists in the DOM
        this._hasQuestionContainer(this, this.$domView, this.getQuestionID());
		
		this.initSubmitBtn();
		this.initResetBtn();

        this.enableSubmit(false);
		this.enableReset(false);
		
		this.initShowAnswerBtn();

        // clear Option, and  reset current UI
        //this._setScenarioAndQuestion();
        this._populateOptionText();

        // ** MCQ activity loaded
        this.bLoaded = true;
        this.dispatchEvent("ACTIVITY_LOADED", {target: this, type: 'ACTIVITY_LOADED', GUID: this.sGUID, eventID: this.sEventID, incidentID: this.sIncidentID});
		if(CourseConfig.getConfig("logger").auto_complete == "true"){
			var ToggleGroup =  this.aMCQList[Math.round(Math.random() * (this.aMCQList.length - 1))];
				var option = ToggleGroup.aOptionsList[0].$domOption;
				setTimeout(function(){
					option.click();
				}, 500);

				setTimeout(function(){
					oScope.$btnSubmit.click();
					
				}, 500);
				
		}
        domMCQTable = null;
    };
    /**
     * Update UI with Response Text
     * show Continue button if available
     * Update expression
     */
    MCQ.prototype._setScenarioAndQuestion = function() {
        var oScope = this,
                oCurrentSet = this.oDataModel.getOptionGroup(),
                //sQuestion				= this.oDataModel.getMCQQuestion(oCurrentSet),
                //sStatement				= this.oDataModel.getMCQScenario(oCurrentSet),
                arrPageText = [],
                $domContainer = "",
                domMCQTable = this.$domView.find("." + oScope.sOptnGrpsCntnrClass),
                PageText = this.oDataModel.getPageTexts();
        if (PageText.length > 0) {
            arrPageText = PageText;
        }
        else {
            arrPageText = [PageText];
        }
        for (var i = 0; i < arrPageText.length; i++) {
            $domContainer = this.getElementByClassName(oScope.$domView, arrPageText[i]._class);
            $domContainer.html(arrPageText[i].__cdata);
            $domContainer.attr("aria-hidden", "false");
        }

        // Show Continue Button is available instead for Showing next options

        domMCQTable = null;
        $domContainer = null;
        // //Logger.logDebug("Reset UI End");
    };

    MCQ.prototype._populateOptionText = function() {

        //Logger.logDebug("_populateOptionText :   : "  );
        var oScope = this,
            oCurrentSet = this.oDataModel.getOptionGroup(),
            aOptions = oCurrentSet.option,
            sStatementID = '',
            $domOptnGrpList = null,
            nMaxPossibleScore = 0,
            aOptionsList = [],
            domMCQTable = this.$domView.find("." + oScope.sOptnGrpsCntnrClass),
            $domOptnGrpsCntnr = this.getElementByClassName(oScope.$domView, oScope.sOptnGrpsCntnrClass),
        	nNumOfOptions = aOptions.length;
        	
        domMCQTable.find("." + oCurrentSet._class).remove();
        for (var i = 0; i < nNumOfOptions; i++) {
            if (this.domTemplate != null) {
                domMCQTable.append(this.domTemplate.clone().attr({
                    'role': 'radio',
                    'aria-labelledby': sStatementID,
                    'title': "Option " + (i + 1)
                }));
            }
        };

        // ** Iterarating within the Option Nodes
        //shuffle the options if randomization is true
        if (typeof this.oDataModel.oDataModel._randomization != "undefined" && this.oDataModel.oDataModel._randomization == "true")
        {
        	aOptions = Globals.shuffleArray(aOptions);        
        };
        
        for (var i = 0; i < nNumOfOptions; i++) {
            var oOption 				= aOptions[i],
                sOptnID 				= oOption._id,
                $domOptnList 			= null,
                sStatementID 			= 'radiogroup_' + (i + 1) + '_label',
                nOptnScore 				= Number(oOption._score),
                aOptnParameters 		= oOption.PARAMETER || null, /* Last edited by: Sachin Tumbre - added support for parameterized feedback */
                sImmediateFeedBack 		= oOption.feedback.content.__cdata,
                sImmediateFeedBackTitle = oOption.feedback.title.__cdata,
                sOptnLblTxt 			= oOption.pageText.__cdata,
                sCondition	 			= oOption._condition || null,
                sTrigger  				= oOption._trigger || null,
                sImage					= oOption._image || null,
                sStyle					= oOption._style	|| null;
                
			this.nMaxPossibleScore 		= Math.max(this.nMaxPossibleScore, nOptnScore);
			
            if (!$domOptnGrpList) {
                $domOptnGrpList = this.getElementByClassName($domOptnGrpsCntnr, oCurrentSet.option[0]._class);
                // ** Check if the number of XML nodes for Radio Containers are Equal to the Number of Radio Containers in the DOM
                if (aOptions.length != $domOptnGrpList.length) {
                    Logger.logError('MCQ._populateLayout() | Number of Radio Containers in the XML dont Match with the DOM');
                }
            }

           var $domOptnGrpPointer = $($domOptnGrpList[i]);
            var $domOptnStmnt = this.getElementByClassName($domOptnGrpPointer, oCurrentSet.option[0].pageText._class);
            this._hasOptionStatement($domOptnStmnt, oCurrentSet.option[0].pageText._class, i, oCurrentSet.option[0]._class);
            $domOptnStmnt.html(sOptnLblTxt).attr({
            'id': sStatementID,
            'contenteditable':'true'	
            });

            // ** Iterarating within the Option node for its text and parameters
            //iterating not needed here
            var nTabIndex = (i === 0) ? 0 : -1;
            /* START - ARIA Implementation */
            $domOptnGrpPointer.attr({
                'id'				: 'radio_' + sOptnID,
                'role'				: 'radiogroup',
                'aria-labelledby'	: sStatementID,
                'data-index'		: String(i),
                'aria-checked'		: 'false',
                'role'				: 'radio',
                'tabindex'			: nTabIndex,
                'aria-posinset'		: (i + 1),
                'aria-setsize'		: nNumOfOptions
            });
            /* END - ARIA Implementation */
            $domOptnGrpPointer.find('.radio-icon').attr('role', 'presentation');
            
            if(sImage && $domOptnGrpPointer.find('.opt-image').length){
            	var $img	= $('<img src="'+sImage+'" >');
            	$domOptnGrpPointer.find('.opt-image').append($img);
            }
            if(sStyle){
            	$domOptnGrpPointer.addClass(sStyle);
            }

            //feedback can contain any properties
            var oOptionData = {
                sImmediateFBTitle: sImmediateFeedBackTitle,
                sImmediateFB	: sImmediateFeedBack,
                trigger			: sTrigger,
                text			: sOptnLblTxt
            };

            // if (this.oDataModel.displayTickCross()) {
                // var sTextForTickCross = parseInt(nOptnScore) > 0 ? "correct" : "incorrect";
                // $domOptnGrpPointer.addClass(sTextForTickCross);
            // }

            var oOptn = new Option($domOptnGrpPointer, sOptnID, "1", nOptnScore, aOptnParameters, oOptionData);
            aOptionsList.push(oOptn);
            $domOptnStmnt.on('click', function(e) {
                e.preventDefault();
            });
			/* check for condtion in session */
            if(sCondition){
             	bCondition = SudoRulesModel.validateRule(sCondition);
             	if(!bCondition){
             		oOptn.exclude();
             	}else{
			       this.nMaxPossibleScore  	= Math.max(this.nMaxPossibleScore, nOptnScore);
             	}
             }else{
			       this.nMaxPossibleScore  	= Math.max(this.nMaxPossibleScore, nOptnScore);             	
             }
        }

        this.oDataModel.setMaxPossibleScore(this.nMaxPossibleScore);

        this.createToggleOptions(aOptionsList);

        $domOptnGrpList = null;
        domMCQTable = null;
        $domOptnGrpsCntnr = null;
        $domOptnGrpPointer = null;
        $domOptnStmnt = null;
    };

    MCQ.prototype.createToggleOptions = function(p_aOptionsList) {
        var oScope = this,
            oMCQToggleGrp = new ToggleGroup(p_aOptionsList);
        oMCQToggleGrp.addEventListener('OPTION_SELECT', this.MCQhandleEvents);
        this.aMCQList.push(oMCQToggleGrp);
        this.oSelectedToggleGrp = oMCQToggleGrp;
    };

    MCQ.prototype._handleEvents = function(e) {
        if (typeof e.preventDefault == 'function') {
            e.preventDefault();
        }
        var oScope = this;
        var target = e.target,
                oOption = e.option,
                currentTarget = e.currentTarget,
                type = e.type,
                oEvent;

        switch (type) {
            case 'OPTION_SELECT':
                oEvent = $.extend({}, e, {oScope: oScope, target: this, toggleGroup: target});
                this.dispatchEvent('OPTION_SELECT', oEvent);
                this._checkAndEnableSubmit();
				this.enableReset(true);
                break;
            case 'SUBMIT':
                oEvent = $.extend({}, e, {oScope: oScope, target: this, toggleGroup: target});
                this._evaluate('SUBMIT');
                this.dispatchEvent('SUBMIT', oEvent);
                break;
            case 'CONTINUE':
                oEvent = $.extend({}, e, {oScope: oScope, target: this, toggleGroup: target});
                this._populateOptionText(this.currentSetID);
                this.dispatchEvent('CONTINUE', oEvent);
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

    MCQ.prototype._checkAndEnableSubmit = function(p_optionID) {
        for (var i = 0; i < this.aMCQList.length; i++) {
            var oMCQToggleGrp = this.aMCQList[i];
            if (!oMCQToggleGrp.getSelectedOption()) {
                this.enableSubmit(false);
                return;
            }
        }
        this.enableSubmit(true);
    };

    MCQ.prototype._evaluate = function() {
        var oMCQToggleGrp = this.oSelectedToggleGrp,
                oSelectedOption = oMCQToggleGrp.getSelectedOption(),
                oSelectedOptionData = oSelectedOption.getOptionData();
        this.disableActivity();
        this.enableReset(false);
        this.enableSubmit(false);
        this.oDataModel.updateAttempNumber();
	

        this.updateScoreAndUserSelections(oSelectedOption, oSelectedOptionData);
        ComponentAbstract.prototype._evaluate.call(this);
    };

    MCQ.prototype.updateScoreAndUserSelections = function(oSelectedOption, oSelectedOptionData) {
        //Logger.logDebug("MCQ.updateScoreAndUserSelections() | "+oSelectedOptionData);

        var sfbType = this.oDataModel.getFeedbackType().toUpperCase(),
                //aUserSelections		= [oSelectedOption.getID(), oSelectedOption.getGroupID()],
                oUserSelections = {
                    optionGroupID: oSelectedOption.getGroupID(),
                    optionID: oSelectedOption.getID()
                },
        score = (sfbType.indexOf("PARAMETERBASED") != -1) ? oSelectedOption.getParameters() : oSelectedOption.getScore();

        var oScope = this,
                oEvent = {
                    type: 'SCORE_UPDATE',
                    target: oScope,
                    preventDefault: false,
                    callback: oScope.updateHistory,
                    args: []
                };

        ComponentAbstract.prototype.updateScoreAndUserSelections.call(this, score, oUserSelections);

        this.dispatchEvent('SCORE_UPDATE', oEvent);
        if (!oEvent.preventDefault) {
            this.updateHistory([oUserSelections]);
        }
    };
    /**
     *  Last updated- Sachin tumbre(12/22/2014) added loop feedbacks in history
     */
    MCQ.prototype.updateHistory = function(p_aSelectedOption) {
        for (var i = 0; i < p_aSelectedOption.length; i++) {
            this.oDataModel.updateFeedbackHistory(p_aSelectedOption[i], i);
        }
        this.oDataModel.getFeedback(true);
        var oScope = this,
                oEvent = {
                    type: 'HISTORY_UPDATE',
                    target: oScope,
                    preventDefault: false,
                    callback: oScope.processFeedbackPopup,
                    args: []
                };

        this.dispatchEvent('HISTORY_UPDATE', oEvent);
        if (!oEvent.preventDefault) {
            this.processFeedbackPopup();
        }
    };

    // ** TODO: Check with Bharat if the method below is used or else remove it
    MCQ.prototype.getUserSelectedOptionID = function(p_nToggleGroupIndex) {
        var oToggleGroup = this.aMCQList[p_nToggleGroupIndex],
                oOption = oToggleGroup.getSelectedOption()[0],
                sOptionID = oOption.getID();

        return sOptionID;
    };

    // ** TODO: Check with Bharat if the method below is used or else remove it
    MCQ.prototype.updateModelScore = function(p_nUserScore, p_aUserScore, p_aUserSelections) {
        this.oDataModel.setScore(p_nUserScore);
        this.oDataModel.setUserScores(p_aUserScore);
        this.oDataModel.setUserSelections(p_aUserSelections);
    };

    MCQ.prototype.disable = function(p_optionID) {
        for (var i = 0; i < this.aMCQList.length; i++) {
            var oMCQToggleGrp = this.aMCQList[i];
            oMCQToggleGrp.enable(false);
        }
        this.enableSubmit(false);
    };

    MCQ.prototype.getOptions = function() {
    	return this.aMCQList[0].getOptionsList();
    };
    
    MCQ.prototype.getOptionByID = function(p_ID) {
    	var aOptions = this.getOptions();
    	for (var i=0; i < aOptions.length; i++) {
		  if(aOptions[i].getID() == p_ID){
		  	return aOptions[i]; 
		  }
		};
		
		return null;
    };
    
    
    MCQ.prototype.disableActivity = function() {
        for (var i = 0; i < this.aMCQList.length; i++) {
            var oMCQToggleGrp = this.aMCQList[i];
            oMCQToggleGrp.enable(false);
            oMCQToggleGrp.removeEventListener('OPTION_SELECT', this.MCQhandleEvents);
        }
        this.enableSubmit(false);
    };

    MCQ.prototype.resetOptions = function() {
        for (var i = 0; i < this.aMCQList.length; i++) {
            var oMCQToggleGrp = this.aMCQList[i];
            oMCQToggleGrp.enable(true);
            oMCQToggleGrp.reset();
            oMCQToggleGrp.removeEventListener('OPTION_SELECT', this.MCQhandleEvents);
            oMCQToggleGrp.addEventListener('OPTION_SELECT', this.MCQhandleEvents);
        }
        this.getView().find('.display-result').removeClass('correct incorrect');
        this.enableReset(false);
        this.enableSubmit(false);
    };

   
	
	
	
	MCQ.prototype.setBookmark								= function(){
		var aUserSelections = this.oDataModel.getScore().getUserSelections();
		for( var i = 0;i < aUserSelections.length;i++){
			var oSelection = aUserSelections[i];
			var id 			= oSelection.optionID;
			var group 		= oSelection.optionGroupID;
			
			for( var j = 0;j < this.aMCQList.length;j++){
				var oToggleGrp = this.aMCQList[j];
				if(oToggleGrp.sGroupID === group){
					oToggleGrp.setSelectedOption(id);
					break;
				}
				
			}
			
		}
	};
	

	
    
	
	
	
    MCQ.prototype.openFeedbackPopup = function(sFeedbackTitle, sFeedback) {
        var oTransitionPopup = this.openPopup('feedback', sFeedbackTitle, sFeedback, $('.btn-submit'));
        oTransitionPopup.setCallback(this, this.checkAndResetOptions);
    };

    MCQ.prototype.checkAndResetOptions = function(p_oPopup, p_oArgs) {
        if (this.isAttemptsCompleted()) {
         	this.enableReset(false);
            this._activityCompleted();
        } else {
            if(this.oDataModel.hasShowAns() || this.oDataModel.hasReset()){
	         	this.enableShowAnswer(true);
	         	this.enableOptions(false);
	            this.enableReset(true);      	         	
            }else{
	           this.resetOptions();           	
	         	this.resetScore();
            }
        }
        ComponentAbstract.prototype.checkAndResetOptions.call(this, p_oArgs);
    };

    MCQ.prototype.resetVariables 			= function() {};
    
	/**
	 * First check acitity level trigger. If not available check Option level trigger 
	 * Notify page with trigger
	 */
    MCQ.prototype.getNextTrigger 			= function() {
    	var trigger 			= this.oDataModel.oDataModel._trigger;
    	var oTrigger			= {};
    	var _optID;
    					
    	if(!trigger){
          var  oSelectedOption 	= this.oSelectedToggleGrp.getSelectedOption();
          	trigger 			= oSelectedOption.getOptionData().trigger;
	    	_optID 				= oSelectedOption.getID();
    	}
    	if(trigger){
	    	oTrigger			= {target:trigger, optID:_optID};
    	}        
    	//console.log('notifyNextTrigger = '+JSON.stringify(oTrigger));
    	return oTrigger;
    };
    MCQ.prototype.isSelectionCorrect = function(p_bEnable) {
        return this.oDataModel.isSelectionCorrect();
    };

    MCQ.prototype._hasOptionStatement = function($domOptnStmnt, sStmntClass, i, sOptnGrpClass) {
        if ($domOptnStmnt.length == 0) {
            Logger.logError('MCQ._populateLayout() | No element with class "' + sStmntClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptnGrpClass + '"');
        }
        if ($domOptnStmnt.length > 1) {
            Logger.logError('MCQ._populateLayout() | More than 1 element with class "' + sStmntClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptnGrpClass + '"');
        }
    };

    MCQ.prototype._hasOptionLabel = function($domOptnLbl, sOptnLblClass, j, i) {
        if ($domOptnLbl.length == 0) {
            Logger.logError('MCQ._populateLayout() | No element with class "' + sOptnLblClass + '" found for Radio Number "' + (j + 1) + '" in Radio Container "' + (i + 1) + '"');
        }
        if ($domOptnLbl.length > 1) {
            Logger.logError('MCQ._populateLayout() | More than 1 element with class "' + sOptnLblClass + '" found for Radio Number "' + (j + 1) + '" in Radio Container "' + (i + 1) + '"');
        }
    };

    MCQ.prototype._hasOptionGroupCotainer = function($domOptnGrpsCntnr, sOptnGrpsCntnrClass, sQuestionID) {
        if ($domOptnGrpsCntnr.length == 0) {
            Logger.logError('MCQ._populateLayout() | No element with class "' + sOptnGrpsCntnrClass + '" found in element "' + sQuestionID + '"');
        }
        if ($domOptnGrpsCntnr.length > 1) {
            Logger.logError('MCQ._populateLayout() | More than 1 element with class "' + sOptnGrpsCntnrClass + '" found in element "' + sQuestionID + '"');
        }
    };
	
	
	MCQ.prototype.getCorrectAnswerID = function(e) {
		return this.oDataModel.oDataModel._correctAnswer;
	};
	MCQ.prototype.popupEventHandler = function(e) {
        var sEventType = e.type, oPopup = e.target, sPopupID = oPopup.getID();
        if (sEventType === 'POPUP_EVENT' || sEventType === 'POPUP_CLOSE') {
            oPopup.removeEventListener('POPUP_CLOSE', this.popupEventHandler);
            oPopup.removeEventListener('POPUP_EVENT', this.popupEventHandler);
				// this.enableReset(true);
                PopupManager.closePopup(sPopupID);
        }
    };
	
    MCQ.prototype.enableOptions = function(p_flag) {
		 for (var i = 0; i < this.aMCQList.length; i++) {
	        var oMCQToggleGrp = this.aMCQList[i];
	        oMCQToggleGrp.enable(p_flag);
	    }
    };
	
    MCQ.prototype.reset = function() {
    	this.resetOptions();
    	this.resetScore();
     	this.enableReset(false);
     	this.resetShowAnswer();
        this.resetVariables(); 
    	this.hideTickCross();
    	this.resetAttemptNumber();
		this.dispatchEvent('RESET_ACTIVITY', {type:'DECISION_COMPLETE', target:oScope, questionID:oScope.getQuestionID()});
    };
    
    
    MCQ.prototype.destroy = function() {
        this.$btnSubmit.off();
        for (var i = 0; i < this.aMCQList.length; i++) {
            var oMCQToggleGrp = this.aMCQList[i];
            oMCQToggleGrp.destroy();
        }

        this.oIncidentController;
        this.aMCQList = null;
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
        this.oSelectedToggleGrp = null;

        ComponentAbstract.prototype.destroy.call(this);
        this.prototype = null;
    };

    MCQ.prototype.toString = function() {
        return 'framework/activity/MCQ';
    };

    return MCQ;
});

