	'use strict';
/**
 * 
 * 
 * @exports activity/viewcontroller/ActvityAbstract
 */
define(['jquery', 
        'framework/utils/globals', 
        'framework/core/PopupManager', 
        'framework/utils/EventDispatcher',
         'framework/utils/Logger', 
         'framework/core/ActivityMarkupCollection',
         'framework/core/AudioManager'
         ],
     function($, Globals, PopupManager, EventDispatcher, Logger, ActivityMarkupCollection, AudioManager) {

    /**
 	 * ComponentAbstract parent class for all Acitivity controller and encapsulates common behaviour for all Activity Controllers. 
     * @constructor
     * @alias ActvityAbstract
     */
    function ComponentAbstract() {
        EventDispatcher.call(this);
        this.sScoringUID;
        this.sGUID;
        this.bIsSimulation;
        this.$domView;
        this.$btnSubmit;
		this.$btnReset;
		this.$btnUserAns;
		this.$btnShowAns;
        this.ParameterizedScore;
        this.oDataModel;
        this.$btnSubmit;
        this.bLoaded;
        this.sQuestionID;
        this.oFeedbackHistory;
        this.$btnReset;
        this.$btnShowAns;
        this.$btnUserAns;
        this.bHasShowAns;
        this.bHasReset;
        this.attempted;
        this.onModelReady = this.onModelReady.bind(this);
        this.popupEventHandler = this.popupEventHandler.bind(this);

        return this;
    }


    ComponentAbstract.prototype = Object.create(EventDispatcher.prototype);
    ComponentAbstract.prototype.constructor = ComponentAbstract;

    ComponentAbstract.prototype.init 								= function(p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation) {
        this.sScoringUID 		= p_sScoringUID;
        this.sGUID 				= p_sGUID;
        this.bIsSimulation 		= p_bIsSimulation;
        this.$domView 			= this.fetchMarkup(p_$domView);
		
        this._createDataModel(p_$xmlActivityNode[0]);
        this.oDataModel.addEventListener('MODEL_READY', this.onModelReady);
        this.oDataModel.loadDependencies();
    };

    /**
     * Sachin Tumbre(12/03/2104) - Load dependencies before rendering UI and notify Listeners
     */
    ComponentAbstract.prototype.onModelReady 						= function() {
    	this.oDataModel.removeEventListener('MODEL_READY', this.onModelReady);
        this.oDataModel.setIsSimulation(this.bIsSimulation || false);
        this.oDataModel.checkFeedBackTypeAndInitializeScore();
        this.oDataModel.checkFeedBackTypeAndInitializeFeedback();

		this.mandatory = (this.oDataModel.oDataModel._mandatory) ?(this.oDataModel.oDataModel._mandatory.toLowerCase() === "true") : true; 
        this.setContent();
        this._populateLayout();
    };
	
	/**
	 * 	Replace activity container in page with activity template in memory ('activity_markup.xml')
	 * 	@param {jQuery} p_$domView -  Activity container
	 */
    ComponentAbstract.prototype.fetchMarkup 						= function(p_$domView) {
        if (p_$domView.children().length === 0) {
            var sMarkupID = p_$domView[0].getAttribute('data-markup');
            if (!sMarkupID || sMarkupID === '') {
                Logger.logError('ComponentAbstract.fetchMarkup() | ERROR: Page Activity DOM has no "data-markup" attribute declared');
            }
            var $activityMarkup = ActivityMarkupCollection.getMarkup(sMarkupID);
            $activityMarkup.attr({
                'id' : p_$domView.attr('id'),
                'class' : p_$domView.attr('class')
            });
            p_$domView.replaceWith($activityMarkup);
            return $activityMarkup;
        }
        return p_$domView;
    };
	
	/**
	 * update activity container view with 'pageText' data inside activity node   
	 */
    ComponentAbstract.prototype.setContent 							= function() {
        var o = this.oDataModel.getPageTextCollection();
        if (o) {
            var oPageText = o.pageText, nPageTextLength = oPageText.length, i;
            if (nPageTextLength) {
                for (var i = 0; i < nPageTextLength; i++) {
                    var oPageTextPointer = oPageText[i];
                    this.populateContent(oPageTextPointer);
                };
            } else {
                this.populateContent(oPageText);
            }
        }
    };
	
	/**
	 * update pageText node data in html. update data using 'ID' & 'Class' mapping.
	 * @param {Object} oPageTextPointer - 'pageText' node data in page xml
	 */
    ComponentAbstract.prototype.populateContent 					= function(oPageTextPointer) {
        var sClassName = oPageTextPointer._class || '', 
        sID = oPageTextPointer._id || '', 
        sContent = oPageTextPointer.__cdata,
        $elem;
        //Logger.logDebug('ComponentAbstract.populateContent() | ');

        if (sID) {
         $elem =    Globals.getElementByID(this.$domView, sID, 'ComponentAbstract.populateContent() | ID = ' + sID).html(sContent);
            //elem.attr('contenteditable','true' );
            return true;
        }
        if (sClassName) {
         $elem =   Globals.getElementByClassName(this.$domView, sClassName, 'ComponentAbstract.populateContent() | Class Name = ' + sClassName).html(sContent);
         //$elem.attr('contenteditable','true' );
        }
    };
    
 	/**
 	 * 	Initialize 'Submit' button
 	 */
    ComponentAbstract.prototype.initSubmitBtn 						= function() {
        var oScope = this;
        this.$btnSubmit = this.$domView.find('.btn-submit').attr('id',this.getQuestionID() + '_submit');
        this.$btnSubmit.click(function(e) {
            e.preventDefault();
            if (oScope.isBtnActive(this)) {
                e.type = 'SUBMIT';
                oScope._handleEvents(e);
            }
        });
    };
    
 	/**
 	 * 	Initialize 'Reset' button
 	 */
    ComponentAbstract.prototype.initResetBtn 						= function() {
		var oScope = this;
		if(this.oDataModel.hasReset()){
			this.$btnReset = this.$domView.find('.btn-reset').attr('id',this.getQuestionID() + '_reset');
			oScope.$btnReset.removeClass("hide");			
	        this.$btnReset.click(function(e) {
	            e.preventDefault();
				if (oScope.isBtnActive(this)) {
					e.type = 'RESET_ANSWER';
					oScope._handleEvents(e);
				}
	        });
		}
		/** END */
    };
    
    /**
     * Initiate 'Show Answer' & 'Your Answer' button 
     */
    ComponentAbstract.prototype.initShowAnswerBtn 					= function() {
    	var oScope = this;
		if(this.oDataModel.hasShowAns()){
			this.$btnShowAns 	= this.$domView.find('.btn-show-ans');
			if(this.$btnShowAns.length){
				this.$btnShowAns.addClass('hide');
				this.$btnShowAns.attr('id',this.getQuestionID() + '_showAns');
					this.$btnShowAns.click(function(e) {
						e.preventDefault();
						if (oScope.isBtnActive(this)) {
							e.type = 'SHOW_ANSWER';
							oScope._handleEvents(e);
						}
					});
					this.$btnShowAns.removeClass('hide');
			};
			
			/** Check and enable Your Answer button */
			this.$btnUserAns 		= this.$domView.find('.btn-show-my-ans');
			if(this.$btnUserAns.length){
				this.$btnUserAns.attr('id',this.getQuestionID() + '_myAns');
				this.$btnUserAns.addClass('hide');
				this.$btnUserAns.click(function(e) {
					e.preventDefault();
					if (oScope.isBtnActive(this)) {
						e.type = 'SHOW_USER_ANSWER';
						oScope._handleEvents(e);
					}
				});
			};		
		};
    };
    

    ComponentAbstract.prototype.updateDataModel 					= function(p_xml) {
        //Logger.logDebug('ComponentAbstract.updateDataModel() '+Globals.toXMLString(p_xml[0]));
        this.oDataModel.updateDataModel(p_xml[0]);
    };

    /**
     * Submit button listener
     * @param {String} p_selectedOptionID - Selected option
     * Abstract method
     */
    ComponentAbstract.prototype._evaluate 							= function(p_selection) {
    	var bShowTickCross 		= this.oDataModel.displayTickCross();
        var displayTrigger		= this.oDataModel.getTickCrossDisplayTrigger();
        if (bShowTickCross) {
            if (displayTrigger.toUpperCase() === "SUBMIT" && this.isAttemptsCompleted()) {
                this.displayTickCross();
            };
        }
    };
    
    /**
     * Display correct and incorrect answers 
     */
    ComponentAbstract.prototype.displayTickCross 					= function() {
		var aOptions 	= this.getOptions(),
		tickcrossType	= this.oDataModel.oDataModel._tickCrossType || null,
		sCorrect 		= this.oDataModel.oDataModel._correctAnswer,
		aCorrect		= sCorrect.split(',');
		
		for (var i=0; i < aOptions.length; i++) {
			var opt 		= aOptions[i];
			var isCorrect 	= (aCorrect.indexOf(opt.getID()) != -1);
			var selected 	= opt.isSelected();
		  	var excludeSel 	= (!isCorrect && !selected && (tickcrossType && tickcrossType.toLowerCase() === "compact"));
		  	if(excludeSel )continue;
		  		
		  	if(isCorrect){
		  		opt.getView().addClass('correct display-result');
		  	}else{
		  		opt.getView().addClass('incorrect display-result');
		  	}
		};
         this.$domView.find(".correctincorrect").removeClass("hide");
    };
	
	/**
	 * Hide correct answer indicators in UI 
	 */
	ComponentAbstract.prototype.hideTickCross 						= function() {
		this.$domView.find('.display-result').removeClass('display-result correct incorrect');
		this.$domView.find('.correctincorrect').addClass('hide');
	};
	
    /**
     *  this is Stub method. Child classes should override this method 
     */
    ComponentAbstract.prototype.getOptions 							= function() {
    	return [];
    	
    };
    
    /**
     *  this is Stub method. Child classes should override this method 
     */
     ComponentAbstract.prototype.getOptionByID 						= function(p_ID) {
		return null;
    };
    
    /**
     * @param {Numbre} p_score			- This could be a STRING, ARRAY or OBJECT.
     * @param {String} p_selectedOptionID	- This could be a STRING, ARRAY or OBJECT. Example: String in case of MCQ, Array in case of Conversation
     */
    ComponentAbstract.prototype.updateScoreAndUserSelections 		= function(p_score, p_selectedOptionID) {
        var sfbType = this.oDataModel.getFeedbackType().toUpperCase();
        // ** Adding up the value to the current score
        this.oDataModel.updateScore(p_score);
        this.oDataModel.updateUserScores(p_score);
        // ** Adding the selected item to the User Selections ARRAY
        this.oDataModel.updateUserSelections(p_selectedOptionID);
    };
 
    ComponentAbstract.prototype._activityCompleted 					= function() {
        var oScope = this;
        if (this.oDataModel.getFeedbackType().toUpperCase().indexOf('PARAMETERBASED') != -1) {
            this.oFeedbackHistory = this.oDataModel.getFeedback(true);
        }
        var bShowTickCross 		= this.oDataModel.displayTickCross();
        var displayTrigger		= this.oDataModel.getTickCrossDisplayTrigger();
        
        if (bShowTickCross && displayTrigger.toUpperCase() === "DEFAULT") {
            this.displayTickCross();
        }
        
		this.attempted = true;
		
		var uid			= this.oDataModel.getScoringUID();
		var trigger		= this.getNextTrigger();

        this.dispatchEvent('ACTIVITY_COMPLETE', {
            'type' 			: 'ACTIVITY_COMPLETE',
            'target' 		: oScope,
			'scoringuid'	:uid,
			'trigger'		:trigger 
        });

    };

	/**
	 * this is a stub method to check if activity has trigger for next action
	 * Each activity will overright this implementation. And dispatch nessasary Event 
	 */
	ComponentAbstract.prototype.getNextTrigger						= function(){
		var trigger 			= this.oDataModel.oDataModel._trigger,
    	oTrigger;
    	if(trigger){
	    	oTrigger			= {target:trigger, optID:''};
    	}        
    	return oTrigger;
	};
	
	/**
	 * Returns true if activity completed (user submited correct answer of attemptes are exosted)
	 * @returns {Boolean}   
	 */
    ComponentAbstract.prototype.isAttemptsCompleted 				= function() {
        return this.oDataModel.isAttemptsCompleted();
    };

    ComponentAbstract.prototype.isSubmitEnabled 					= function() {
        return !this.$btnSubmit.hasClass('disabled');
    };

    ComponentAbstract.prototype.openPopup 							= function(p_sPopupID, p_sTitle, p_sContent, p_$returnFocusTo, p_sClassesToAdd, p_fCallback, p_aArgs) {
        var sClass = p_sClassesToAdd || "";
        sClass += this.oDataModel.isCorrect() ? " correct " : " incorrect ", sClass += "attempt-" + this.oDataModel.getCurrentAttempt() + " ", sClass += this.oDataModel.getQuestionID();
	    
	    var oPopup = PopupManager.openPopup(p_sPopupID, {
            txt_title : p_sTitle,
            txt_content : p_sContent
        }, p_$returnFocusTo, sClass);
    
        oPopup.addEventListener('POPUP_CLOSE', this.popupEventHandler);
        oPopup.addEventListener('POPUP_EVENT', this.popupEventHandler);    
        
        if (p_fCallback) {
            oPopup.setCallback(this, p_fCallback, p_aArgs);
        }
        return oPopup;
    };

    ComponentAbstract.prototype.popupEventHandler 					= function(e) {
        var sEventType = e.type, oPopup = e.target, sPopupID = oPopup.getID();

        if (sEventType === 'POPUP_EVENT' || sEventType === 'POPUP_CLOSE') {
            oPopup.removeEventListener('POPUP_CLOSE', this.popupEventHandler);
            oPopup.removeEventListener('POPUP_EVENT', this.popupEventHandler);
            //if (sEventType === 'POPUP_EVENT') {
                PopupManager.closePopup(sPopupID);
            //}
        }
    };
	
	/**
	 * Reset current stored score 
	 */
    ComponentAbstract.prototype.resetScore 							= function() {
        this.oDataModel.oScore.reset();
    };
    
	/**
	 * Reset current stored attempt count
	 */
    ComponentAbstract.prototype.resetAttemptNumber 					= function() {
        this.oDataModel.resetAttemptNumber();
    };

    ComponentAbstract.prototype.getScore 							= function() {
        return this.oDataModel.oScore;
    };
   
    ComponentAbstract.prototype.setMaxPossibleScore 				= function(p_nMaxPossibleScore) {
        this.oDataModel.setMaxPossibleScore(p_nMaxPossibleScore);
    };
    
    ComponentAbstract.prototype.getMaxPossibleScore 				= function() {
        return this.oDataModel.getMaxPossibleScore();
    };
  	
  	/**
  	 * Returns Array of user selected option Ids  
  	 */
    ComponentAbstract.prototype.getUserSelections					= function() {
        return this.oDataModel.getUserSelections();
    };
    
    /**
     * Returns true if user has achived 100%  
     */
    ComponentAbstract.prototype.isCorrect 							= function() {
        return this.oDataModel.isCorrect();
    };
   
    ComponentAbstract.prototype.updateAttempNumber 					= function() {
        this.oDataModel.updateAttempNumber();
    };

    ComponentAbstract.prototype._hasQuestionContainer 				= function($domActivity, sQuestionID) {
        if ($domActivity.length == 0) {
            Logger.logError('MCQGroup._populateLayout() | No element with Question ID "' + sQuestionID + '" found.');
        }
        if ($domActivity.length > 1) {
            Logger.logError('MCQGroup._populateLayout() | More than 1 element with Question ID "' + sQuestionID + '" found.');
        }
    };
	
	/**
	 *	Returns scoring UID for current activity i.e. cw01~cw01~pg01~mcq_1
	 * @returns {String} 
	 */
    ComponentAbstract.prototype.getScoringUID 						= function() {
        return this.oDataModel.getScoringUID();
    };

     /**
     * Returns question ID i.e. mcq_1 
     */
    ComponentAbstract.prototype.getQuestionID 						= function() {
        return this.oDataModel.getQuestionID();
    };

    ComponentAbstract.prototype.getBookmark 						= function() {
        return this.oDataModel.getBookmark();
    };

    ComponentAbstract.prototype.getFeedback 						= function() {
        //Logger.logDebug("ComponentAbstract.processFeedbackPopup() | ");
        return this.oDataModel.getFeedback();
    };

    ComponentAbstract.prototype.processFeedbackPopup 				= function() {
        var oScope          = this,
            oFeedback       = this.getFeedback(),
            sFeedbackTitle  = oFeedback.getTitle(),
            sFeedback       = oFeedback.getContent(),
            sClassesToAdd   = oFeedback.getStyle(),
            sAudioID        = oFeedback.getAudioID(),
            oTransitionPopup,
            oEvent = {
                target              : oScope,
                popup               : oTransitionPopup
            };
        //Logger.logDebug("ComponentAbstract.init() | \n\tShowFeedbackPopup = "+this.oDataModel.isShowFeedbackPopup());
        if(this.oDataModel.isShowFeedbackPopup()){
            oTransitionPopup = this.openPopup('feedback', sFeedbackTitle, sFeedback, $('.btn-submit'), sClassesToAdd);
            if(sAudioID != undefined){
                AudioManager.playAudio(sAudioID);               
            }
            oTransitionPopup.setCallback(this, this.checkAndResetOptions , [{audioID: sAudioID}]);

        }else{
            this.checkAndResetOptions();
        }
        this.dispatchEvent('AFTER_ACTIVITY_POPUP', oEvent);
        
    };
    
    /**
     * Returns container for the activity (jQuery element)
     * @returns {jQuery}   
     */
    ComponentAbstract.prototype.getView 							= function() {
        return this.$domView;
    };
	
    ComponentAbstract.prototype.checkAndResetOptions 				= function(p_oArgs) {
        if(AudioManager.isPlaying() && AudioManager.getCurrentAudioID() === p_oArgs.audioID){
            AudioManager.stop();
        }

    };
    
    /**
     * Reset tick cross elements from otions 
     */
    ComponentAbstract.prototype.hideAnswers 						= function(p_$domScope, p_sID) {
    	this.$domView.find(".correct").removeClass("correct");   
    	this.$domView.find(".incorrect").removeClass("incorrect");   
    	this.$domView.find(".correctincorrect").addClass("hide");   
    	
    };
    
    ComponentAbstract.prototype.getElementByID 						= function(p_$domScope, p_sID) {
        //Logger.logDebug('ComponentAbstract.getElementByID() | DOM Scope = '+p_$domScope+' : ID = '+p_sID);
        var $elem = (p_$domScope.attr('id') === p_sID) ? p_$domScope : p_$domScope.find('#' + p_sID);
        //Logger.logDebug('ComponentAbstract.getElementByID() | Element Length = '+$elem.length);
        if ($elem.length == 0) {
            Logger.logError('ComponentAbstract.getElementByID() | No Elements found with the name "' + p_sID + '"');
        }
        if ($elem.length > 1) {
            Logger.logWarn('ComponentAbstract.getElementByID() | More than 1 element has the same ID "' + p_sID + '"');
        }
        return $elem;
    };

    ComponentAbstract.prototype.getElementByClassName 				= function(p_$domScope, p_sClass) {
        if ( typeof p_$domScope.find !== 'function') {
            return;
        }
        var $elems = p_$domScope.find('.' + p_sClass);
        //Logger.logDebug('ComponentAbstract.getElementByClassName() | Element Length = '+$elems.length);
        if ($elems.length == 0) {
            Logger.logError('ComponentAbstract.getElementByClassName() | No Elements found with the name "' + p_sClass + '"');
        }
        return $elems;
    };

    ComponentAbstract.prototype.isBtnActive 						= function(p_domBtn) {
        var isActive = ($(p_domBtn).hasClass('inactive') || $(p_domBtn).hasClass('disabled')) ? false : true;
        return isActive;
    };

    ComponentAbstract.prototype.sanitizeValue 						= function(p_sValue, p_sDefaults) {
        var sValue = p_sValue.split(' ').join(''), retVal;
        //Logger.logDebug('ComponentAbstract.sanitizeValue() | Value = '+p_sValue+' : Default = '+p_sDefaults);

        if (!sValue || sValue === '' || sValue === null || sValue === undefined) {
            // ** Value is Not Specified OR Undefined
            retVal = p_sDefaults;
        } else if (sValue.toUpperCase() === 'TRUE' || sValue.toUpperCase() === 'FALSE') {
            // ** Value is a Boolean
            retVal = (sValue.toUpperCase() === 'TRUE') ? true : false;
        } else if (!isNaN(Number(sValue))) {
            // ** Value is a Number
            retVal = Number(p_sValue);
        } else {
            // ** Its a String
            retVal = p_sValue;
        }
        return retVal;
    };

    ComponentAbstract.prototype.enableSubmit 						= function(p_bEnable) {
         if (p_bEnable) {
            this.$btnSubmit.removeClass('disabled').attr({
                'aria-disabled': false
            });
            this.$btnSubmit.removeAttr("disabled");

        } else {
            this.$btnSubmit.addClass('disabled').attr({
                'aria-disabled': true
            });
            this.$btnSubmit.attr("disabled", "true");
        };
        this.dispatchEvent('SUBMIT_ENABLED', {type: 'SUBMIT_ENABLED', target: this , enabled:p_bEnable});
    };

    ComponentAbstract.prototype.enableReset 						= function(p_bEnable) { 
        if(!this.oDataModel.hasReset())return;
        if (p_bEnable) { 
            this.$btnReset.removeClass('disabled').attr({ 
                'aria-disabled': false 
            }); 
            this.$btnReset.removeAttr("disabled");
        } else { 
            this.$btnReset.addClass('disabled').attr({ 
                'aria-disabled': true 
            }); 
            this.$btnReset.attr("disabled", "true");
        } 
    };
    
    ComponentAbstract.prototype.enableShowAnswer 					= function(p_bEnable) {
        if(!this.oDataModel.hasShowAns())return;
        if (p_bEnable) {
            this.$btnShowAns.removeClass('disabled').attr({
                'aria-disabled': false
            });
            this.$btnShowAns.removeAttr("disabled");

        } else {
            this.$btnShowAns.addClass('disabled').attr({
                'aria-disabled': true
            });
            this.$btnShowAns.attr("disabled", "true");
        }
    };
    
    ComponentAbstract.prototype.hasLoaded 							= function() {
        return this.bLoaded;
    };
    
    /**
     * Show Correct Answer  
     */
    ComponentAbstract.prototype.showAnswer 							= function(p_bUser) {
		var oScope = this,		
		aOptions 	= this.getOptions(),
		sCorrect 		= this.oDataModel.oDataModel._correctAnswer,
		aCorrect		= sCorrect.split(','),
		aSelection		= this.oDataModel.getScore().getUserSelections();
		
	  	if((!p_bUser)) {
			for (var i=0; i < aOptions.length; i++) {
				var opt 		= aOptions[i],
				isCorrect 	= (aCorrect.indexOf(opt.getID()) != -1),
				selected 	= opt.isSelected(),
				sStyle		= (isCorrect)? 'correct' : '';			
			  		if(isCorrect){
				  		opt.getView().addClass('correct display-result');
			  		}
			  	opt.selected(false, true);// change view state only.		  		
		  	}
	       	this.$domView.find(".correctincorrect").removeClass("hide");
		}else{
	  		for (var i=0; i < aSelection.length; i++) {
				var oSele	=	aSelection[i],
				opt			= this.getOptionByID(oSele.optionID); 
		  		opt.getView().removeClass('correct display-result');
		        this.$domView.find(".correctincorrect").addClass("hide");
			  	opt.selected(true, true); // change view state only.		  		
		  	}
			
		};		
		
		

	};

	/**
	 *  Reset Show Answer feature 
	 */
	 ComponentAbstract.prototype.clearAnswerView 					= function() {
		this.hideTickCross();
		var aOptions 	= this.getOptions();
		for (var i=0; i < aOptions.length; i++) {
			var opt 		= aOptions[i];
	  		opt.getView().removeClass('correct display-result');
		  	opt.selected(true, true); // change view state only.		  		
		};		
	 	
	 };

	/**
	 * Enable/disable 'Show Answer' button
	 * @param {Boolean} p_bEnable
	 */
	 ComponentAbstract.prototype.enableShowAnswer 					= function(p_bEnable) {
	 	 if(!this.oDataModel.hasShowAns())return;
	 	 if (p_bEnable) { 
            this.$btnShowAns.removeClass('disabled').attr({ 
                'aria-disabled': 'false' 
            }); 
            this.$btnShowAns.removeAttr("disabled");
        } else { 
            this.$btnShowAns.addClass('disabled').attr({ 
                'aria-disabled': 'true' 
            }); 
            this.$btnShowAns.attr("disabled", "true");
        } 
	 };
	 
	 ComponentAbstract.prototype.resetShowAnswer 					= function(p_bEnable) {
	 	 if(!this.oDataModel.hasShowAns())return;
           this.enableShowAnswer(false); 
           this.$btnShowAns.removeClass('hide'); 
           this.$btnUserAns.addClass('hide'); 
	 	
	 	
	 };
	  
    /**
     * Check if object is valid DOM lengh. Found this solution on stack overflow;
     * Checks only jQuery object
     * @param {Object} jQueryObj
     */
    // ** TODO: Remove this method and use Globals.getElementByID method instead
    ComponentAbstract.prototype.isValidDomElement 					= function(jQueryObj) {
        //Logger.logDebug('ComponentAbstract.isValidDomElement | '+(jQueryObj.length > 0 ));
        return (jQueryObj.length > 0 );
    };

    ComponentAbstract.prototype.isArray 							= function(p_aValue) {
        var bIsArray = (p_aValue.length) ? true : false;
        return bIsArray;
    };
    
 	ComponentAbstract.prototype.resetVariables 						= function() {};
 	
 	/**
 	 * Clear memory 
 	 */
    ComponentAbstract.prototype.destroy 							= function() {
        this.oDataModel.destroy();
        this.$domView = null;
        this.oDataModel = null;
        this.$btnSubmit = null;
        this.bLoaded = null;
        EventDispatcher.prototype.destroy.call(this);
        this.prototype = null;
    };

    ComponentAbstract.prototype.toString = function() {
        return 'framework/activity/ComponentAbstract';
    };

    return ComponentAbstract;
});

