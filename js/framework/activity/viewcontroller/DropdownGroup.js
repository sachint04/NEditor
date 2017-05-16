/**
 * A module represents Timeline and flash like Play/Pause controls.
 * @exports js/activity/DropndownGroup 
 */
define([ 
    'jquery', 
    'framework/utils/globals', 
    'framework/activity/viewcontroller/ActivityAbstract', 
    'framework/activity/model/DropdownGroupModel', 
    'framework/activity/viewcontroller/Dropdown', 
    'framework/utils/Logger' 
], function($, Globals, ComponentAbstract, DropdownGroupModel, Dropdown, Logger) { 

	/**
	 * 
	 * DropdownGroup Constructor
	 * @constructor 
	 * @alias DropdownGroup
	 */
    function DropdownGroup() { 
        //Logger.logDebug('DropdownGroup.CONSTRUCTOR() '); 
        ComponentAbstract.call(this); 
        this.aDDList = []; 
        this.$domTemplate;
 		this.DDhandleEvents = this._handleEvents.bind(this);
        return this; 
    } 

    DropdownGroup.prototype = Object.create(ComponentAbstract.prototype); 
    DropdownGroup.prototype.constructor = DropdownGroup; 

	/**
	 *  
	 */
    DropdownGroup.prototype.init = function(p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation) { 
        //Calling Super Class "init()" function 
        ComponentAbstract.prototype.init.call(this, p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation); 
    }; 

    DropdownGroup.prototype._createDataModel = function(p_xmlActivityNode) { 
        this.oDataModel = new DropdownGroupModel(p_xmlActivityNode,  this.sGUID, this.sScoringUID); 

        /*** Listener to the DATA MODEL can be added here to listen to Model updates ***/ 
        /*this.oDataModel.addEventListener('UPDATE', function(e){ 
         oScope.handleModelUpdates(e); 
         });*/ 
    }; 

    /*** Model updates Handler to be used if required ***/ 
    /*DropdownGroup.prototype.handleModelUpdates = function(e){ 
     
     };*/ 
	
	/**
	 * Activity UI rendering common function 
	 */
    DropdownGroup.prototype._populateLayout = function() { 
        var oScope = this, 
            sQuestionID 			= this.oDataModel.getQuestionID(), 
            sOptnGrpsCntnrClass 	= this.oDataModel.getOptionGroupsContainerClass(), 
            aOptionGroups 			= this.oDataModel.getOptionGroup(), 
            $domActivity 			= this.getElementByID(this.$domView, sQuestionID),
            $domTemplate 			= this.$domView.find(".dropdown-container"), 
            $domOptnGrpList 		= null, 
            nMaxPossibleScore 		= 0;

	        // ** Check to make sure that an element with the specified Question ID exists in the DOM 
	        this._hasQuestionContainer(this, $domActivity, sQuestionID); 
			
	        ///dropdown-groups-container 
	        var $domOptnGrpsCntnr = this.getElementByClassName($domActivity, sOptnGrpsCntnrClass); 
	        // ** Check to make sure that a Radio Group Container exists in the DOM to hold the Groups of Radio Button Containers 
	        this._hasOptionGroupCotainer($domOptnGrpsCntnr, sOptnGrpsCntnrClass, sQuestionID); 
	
	        /* START - ARIA Implementation */ 
	        $domActivity.attr({ 
	            'role': 'application', 
	            'tabindex': -1 
	        }); 
        /* END - ARIA Implementation */ 

		  

        // ** Iterarating within the Option Group Node 
        for (var i = 0; i < aOptionGroups.length; i++) { 
            var oOptionGroupPointer 	= aOptionGroups[i], 
                sOptnGrpID 				= 'DropdownGroup_' + oOptionGroupPointer._id, 
                sOptnGrpClass 			= oOptionGroupPointer._class, 
                sStmntClass 			= oOptionGroupPointer.pageText._class, 
                sStmntTxt 				= oOptionGroupPointer.pageText.__cdata, 
                $domOptnList 			= null, 
                nMaxScore 				= 0, 
                aOptionsList 			= [], 
                sStatementID 			= 'dropdown_' + (i + 1) + '_label'; //Custom Vars 

            //refer to dropdown-container 
            if (!$domOptnGrpList) { 
                $domOptnGrpList = this.getElementByClassName($domOptnGrpsCntnr, sOptnGrpClass); 
                // ** Check if the number of XML nodes for Radio Containers are Equal to the Number of Radio Containers in the DOM 
                if (aOptionGroups.length != $domOptnGrpList.length) { 
			        for (var s = 0; s < aOptionGroups.length; s++) {
			            if ($domTemplate.length) {
			                $domOptnGrpsCntnr.append($domTemplate.clone().removeClass('template'));
			            }
			        };
	                $domTemplate.remove(); 
	                $domOptnGrpList = this.getElementByClassName($domOptnGrpsCntnr, sOptnGrpClass);
                } 
            } 
            $domOptnGrpPointer = $domOptnGrpList.eq(i).attr('id','dropdown_container'+ (i + 1));
             

            var $domOptnStmnt = this.getElementByClassName($domOptnGrpPointer, sStmntClass); 
            this._hasOptionStatement($domOptnStmnt, sStmntClass, i, sOptnGrpClass); 
            $domOptnStmnt.html(sStmntTxt).attr('id', sStatementID); 

            // ** Iterarating within the Option node for its text and parameters 
            for (var j = 0; j < oOptionGroupPointer.option.length; j++) { 
                var oOption 			= oOptionGroupPointer.option[j]; 
                oOption.sOptnID 		= oOption._id; 
                oOption.sOptnClass 		= oOption._class; 
                oOption.nOptnScore 		= Number(oOption._score); 
                oOption.aOptnParameters = oOption.parameter; 
                oOption.sOptnLblClass 	= oOption.pageText._class; 
                oOption.sOptnLblTxt 	= oOption.pageText.__cdata; 
                nMaxScore 				= Math.max(nMaxScore, oOption.nOptnScore), 
                sOptnClass 				= oOption._class; 

                aOptionsList.push(oOption); 
            } 

            var $domOptn = this.getElementByClassName($domOptnGrpPointer, sOptnClass), 
                    nTabIndex = (i + 1), 
                    nNumOfOptions = aOptionGroups.length; 
            $domOptn.attr({ 
                'role': 'combobox',   			/* START - ARIA Implementation */ 
                'aria-labelledby': sStatementID, 
                'tabindex': nTabIndex, 		/*'aria-activedescendant' : 'rg1-r4'*/ 
                'aria-posinset': (i + 1),		/*'aria-readonly' : true, 'aria-autocomplete' : 'none',*/ 
                'aria-setsize': nNumOfOptions 
            }); 

            this._hasOptionContainer($domOptn, sOptnClass, i, sOptnGrpClass); 
            this.createDropdown($domOptn, sOptnGrpID, aOptionsList); 
            nMaxPossibleScore += nMaxScore; 
        } 

        this.oDataModel.setMaxPossibleScore(nMaxPossibleScore); 
        var sSubmitID = sQuestionID + '_submit'; 
        this.$btnSubmit = this.$domView.find('.btn-submit').attr('id',this.getQuestionID() + '_submit'); 
        this.$btnSubmit.addClass('btn disabled').attr({ 
            /* START - ARIA Implementation */ 
            'role': 'button', 
            /* END - ARIA Implementation */ 
            'tabindex': (nTabIndex + 1) 
        }).on('click', function(e) { 
            e.preventDefault(); 
            if (oScope.isBtnActive(this)) { 
                e.type = 'SUBMIT'; 
                oScope._handleEvents(e); 
            } 
        }); 
        this.enableSubmit(false); 
        this.initResetBtn();
      	this.initShowAnswerBtn();
			
        this.bLoaded = true; 
        this.dispatchEvent("ACTIVITY_LOADED", {target: this, type: 'ACTIVITY_LOADED', GUID: this.sGUID, eventID: this.sEventID, incidentID: this.sIncidentID}); 
    }; 

    DropdownGroup.prototype.createDropdown = function(p_domOptn, p_sOptnGrpID, p_aOptionsList) { 
        var oScope = this, 
                oDD = new Dropdown(p_domOptn, p_sOptnGrpID, p_aOptionsList); 

        oDD.addEventListener('OPTION_SELECT', this.DDhandleEvents); 

        this.aDDList.push(oDD); 
    }; 
	
	/**
	 *	Internal event handlers
	 * @param {Object} e - UI event object 
	 */
    DropdownGroup.prototype._handleEvents = function(e) { 
        if (typeof e.preventDefault == 'function') { 
            e.preventDefault(); 
        } 
        var target = e.target, 
                currentTarget = e.currentTarget, 
                type = e.type; 

        Logger.logDebug('-------------------DropdownGroup._handleEvents() | type  = '+type); 

        switch (type) { 
            case 'OPTION_SELECT': 
                this._dispatchSelectEvent(e); 
                this._checkAndEnableSubmit(); 
                break; 
            case 'SUBMIT': 
                this._evaluate(); 
                break;
            case 'RESET_ANSWER' :
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

    DropdownGroup.prototype._dispatchSelectEvent = function(e) { 
        this.dispatchEvent('OPTION_SELECT', {type: 'OPTION_SELECT', target: e.target}); 
    }; 

    DropdownGroup.prototype._checkAndEnableSubmit = function(p_optionID) { 
        for (var i = 0; i < this.aDDList.length; i++) { 
            var oDD = this.aDDList[i]; 
            if (!oDD.getSelectedOption()) { 
                this.enableSubmit(false); 
                return; 
            } 
        } 
        this.enableSubmit(true); 
    }; 
   
    DropdownGroup.prototype._evaluate = function() { 
        this.disableActivity(); 
        this.enableSubmit(false); 
        this.enableReset(true); 
        this.oDataModel.updateAttempNumber(); 
        this.updateScoreAndUserSelections(); 
        ComponentAbstract.prototype._evaluate.call(this);

    }; 

    DropdownGroup.prototype.updateScoreAndUserSelections = function() { 
        var sfbType = this.oDataModel.getFeedbackType().toUpperCase(); 
        for (var i = 0; i < this.aDDList.length; i++) { 
            var oToggleGrp 			= this.aDDList[i],
            	oSelectedOption 	= oToggleGrp.getSelectedOptionObj(),
		    	changeflagto		= oSelectedOption._changeflagto,
		    	groupFlag			= oToggleGrp.changeflagto,
                aUserSelections 	= oSelectedOption,
                score 				= oToggleGrp.getScore();
                if(sfbType.indexOf("PARAMETERBASED") != -1){
                	score = [];
                	if(oSelectedOption.PARAMETER){
	                	score = (oSelectedOption.PARAMETER.length != undefined)?oSelectedOption.PARAMETER: [oSelectedOption.PARAMETER];
                	}
                }
            ComponentAbstract.prototype.updateScoreAndUserSelections.call(this, score, aUserSelections); 
        } 
        
        oScope = this, 
                oEvent = { 
                    type: 'SCORE_UPDATE', 
                    target: oScope, 
                    preventDefault: false, 
                    callback: oScope.updateHistory, 
                    args: [] 
                }; 
		if(this.oDataModel.hasShowAns() && !this.isCorrect()){
			this.$btnShowAns.removeClass('disabled');
		}
        this.dispatchEvent('SCORE_UPDATE', oEvent); 
        if (!oEvent.preventDefault) { 
            this.updateHistory(); 
        } 
    }; 

    DropdownGroup.prototype.updateHistory = function() { 
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

	/**
	 * Validate correct and user answer and show tick cross for user selection and correct answers
	 * 
	 */
    DropdownGroup.prototype.displayTickCross = function() { 
    	//Not applicable for ParameterBased  Feedback. 
        if(this.oDataModel.getFeedbackType().toUpperCase().indexOf("PARAMETERBASED") !=  -1){
        	return;
        }
        for (var i = 0; i < this.aDDList.length; i++) { 
            var oToggleGrp 		= this.aDDList[i],
            	$opt			= oToggleGrp.$domOption,
            	$optContainer 	= oToggleGrp.$domOption.closest('.dropdown-container'),
            	$tickcross		= $optContainer.find('.correctincorrect'),
                sfbType 		= this.oDataModel.getFeedbackType().toUpperCase(), 
                score 			= oToggleGrp.getScore(); 
            
            sTextForTickCross = parseInt(score) > 0 ? "correct" : "incorrect"; 
           	$optContainer.addClass("display-result " +sTextForTickCross); 
			$tickcross.removeClass("hide");
        } 
         
    }; 

    DropdownGroup.prototype.openFeedbackPopup = function(sFeedbackTitle, sFeedback) { 
        var oTransitionPopup = this.openPopup('feedback', sFeedbackTitle, sFeedback, $('.btn-submit')); 
        oTransitionPopup.setCallback(this, this.checkAndResetOptions); 
    }; 

    DropdownGroup.prototype.disable = function(p_optionID) { 
        for (var i = 0; i < this.aDDList.length; i++) { 
            var oDD = this.aDDList[i]; 
            oDD.enable(false); 
        } 
        this.enableSubmit(false); 
    }; 

    DropdownGroup.prototype.checkAndResetOptions = function(p_oPopup, p_oArgs) { 
        if (this.isAttemptsCompleted()) { 
            this.disableActivity(); 
            this._activityCompleted(); 
        }if(!this.isCorrect()){
        	if(this.oDataModel.hasReset())
        	this.enableReset(true);
        	
         	if(this.oDataModel.hasShowAns())
         	this.enableShowAnswer(true);
         	
         }else {
           if(this.oDataModel.hasShowAns() || this.oDataModel.hasReset()){
	         	this.enableShowAnswer(true);
	         	this.resetOptions(false);
	            this.enableReset(true);      	         	
            }else{
	           this.resetOptions();           	
            }    	 
           
        } 
       
        ComponentAbstract.prototype.checkAndResetOptions.call(this, p_oArgs);
         
    }; 

    DropdownGroup.prototype.disableActivity = function() { 
        //Logger.logDebug('DropdownGroup.disableActivity'+ this.aDDList.length); 
        for (var i = 0; i < this.aDDList.length; i++) { 
            var oDD = this.aDDList[i]; 

            oDD.enable(false); 
            oDD.removeEventListener('OPTION_SELECT', this.DDhandleEvents); 
        } 
		
        this.enableSubmit(false); 
    }; 

    DropdownGroup.prototype.updateModelScore = function(p_nUserScore, p_aUserScore, p_aUserSelections) { 
        this.oDataModel.setScore(p_nUserScore); 
        this.oDataModel.setUserScores(p_aUserScore); 
        this.oDataModel.setUserSelections(p_aUserSelections); 
    }; 


    DropdownGroup.prototype.reset = function() { 
    	this.resetOptions();
    	this.resetScore();
     	this.enableReset(false);
     	this.resetShowAnswer();
        this.resetVariables(); 
    	this.hideTickCross();
    	this.resetAttemptNumber();
    	this.dispatchEvent('RESET', {type:'RESET', target:this});  	
    };

    DropdownGroup.prototype.resetOptions = function() { 
        for (var i = 0; i < this.aDDList.length; i++) { 
            var oDD = this.aDDList[i]; 
            oDD.reset();
            oDD.addEventListener('OPTION_SELECT', this.DDhandleEvents);  
        } 
        this.getView().find('.display-result').removeClass('correct incorrect');
        this.getView().find('.display-result').removeClass('display-result');
        
        this.enableReset(false);
        this.enableSubmit(false);
        if(this.oDataModel.hasShowAns()){
	        this.$btnShowAns.removeClass('hide').addClass('disabled'); 
	        this.$btnUserAns.addClass('hide');
        } 
    }; 
     
    DropdownGroup.prototype.showCorrectAnswer = function(p_bEnable) { 
    	for (var i=0; i <  this.aDDList.length; i++) {
		   this.aDDList[i].showCorrectAnswer();
		};
		this.getView().find('.correctincorrect').addClass('hide');
    };
    DropdownGroup.prototype.showUserAnswer = function(p_bEnable) { 
    	for (var i=0; i <  this.aDDList.length; i++) {
		   this.aDDList[i].showUserAnswer();
		};
		this.getView().find('.correctincorrect').removeClass('hide');
    };

    DropdownGroup.prototype._hasOptionStatement = function($domOptnStmnt, sStmntClass, i, sOptnGrpClass) { 
        if ($domOptnStmnt.length == 0) { 
            Logger.logError('DropdownGroup._populateLayout() | No element with class "' + sStmntClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptnGrpClass + '"'); 
        } 
        if ($domOptnStmnt.length > 1) { 
            Logger.logError('DropdownGroup._populateLayout() | More than 1 element with class "' + sStmntClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptnGrpClass + '"'); 
        } 
    }; 

    DropdownGroup.prototype._hasOptionContainer = function($domOptn, sOptnClass, i, sOptnGrpClass) { 
        if ($domOptn.length == 0) { 
            Logger.logError('DropdownGroup._populateLayout() | No element with class "' + sOptnClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptnGrpClass + '"'); 
        } 
        if ($domOptn.length > 1) { 
            Logger.logError('DropdownGroup._populateLayout() | More than 1 element with class "' + sOptnClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptnGrpClass + '"'); 
        } 
    }; 

    DropdownGroup.prototype._hasOptionGroupCotainer = function($domOptnGrpsCntnr, sOptnGrpsCntnrClass, sQuestionID) { 
        if ($domOptnGrpsCntnr.length == 0) { 
            Logger.logError('DropdownGroup._populateLayout() | No element with class "' + sOptnGrpsCntnrClass + '" found in element "' + sQuestionID + '"'); 
        } 
        if ($domOptnGrpsCntnr.length > 1) { 
            Logger.logError('DropdownGroup._populateLayout() | More than 1 element with class "' + sOptnGrpsCntnrClass + '" found in element "' + sQuestionID + '"'); 
        } 
    }; 

    DropdownGroup.prototype.destroy = function($domOptnGrpsCntnr, sOptnGrpsCntnrClass, sQuestionID) { 
        var oScope = this; 
        this.$btnSubmit.off(); 
    }; 

    DropdownGroup.prototype.toString = function() { 
        return 'framework/activity/DropdownGroup'; 
    }; 

    return DropdownGroup; 
}); 
