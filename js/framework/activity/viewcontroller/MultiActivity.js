define([
	'jquery',
	'framework/utils/globals',
	'framework/activity/viewcontroller/ActivityAbstract',
	'framework/activity/ToggleGroup',
	'framework/model/CourseConfigModel',
	'framework/core/AudioManager',
	'framework/activity/model/MultiActivityModel',
	'framework/activity/viewcontroller/Option',
	'framework/utils/ResourceLoader',
	'framework/utils/Logger'
], function($, Globals, ComponentAbstract,ToggleGroup, CourseConfig, AudioManager, MultiActivityModel, Option, ResourceLoader, Logger){

	function MultiActivity(){
		//Logger.logDebug('MultiActivity.CONSTRUCTOR() ');
		ComponentAbstract.call(this);
		this.aActivityData = [];
		this.$btnReset; 
		this.oPage;
 		this.MultiActivityhandleEvents 	= this._handleEvents.bind(this);
 		this.ActivityHandleEvent 	= this.ActivityHandleEvent.bind(this);

		return this;
	}

	MultiActivity.prototype										= Object.create(ComponentAbstract.prototype);
	MultiActivity.prototype.constructor							= MultiActivity;
	MultiActivity.prototype.init									= function(p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation, oPage){
		//Logger.logDebug('MultiActivity.init() | '+p_$domView);
		// ** Calling Super Class "init()" function
		//ComponentAbstract.prototype.init.call(this, p_xmlActivityNode, p_$domView);
		$xmlActivity	= p_$xmlActivityNode;
		this.oPage = oPage;
		ComponentAbstract.prototype.init.call(this, p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation);

	};

    /**
    * Last edited by : Sachin Tumbre
    * date: 12/01/2014
    * Moving activity level logic to 'onModelReady' method
    */
	MultiActivity.prototype._createDataModel						= function(p_xmlActivityNode){
        this.oDataModel = new MultiActivityModel(p_xmlActivityNode,  this.sGUID, this.sScoringUID);
	};

	MultiActivity.prototype._populateLayout						=  function(sExpressionID,sTrigger){
		var oScope				= this;
		// ** Check to make sure that an element with the specified Question ID exists in the DOM
        this._hasQuestionContainer(this, this.$domView, this.getQuestionID());
        var aActivity = this.oDataModel.getDependencyList();
        var nMaxPossibleScore = 0;
        for(var i= 0; i<aActivity.length;i++){
            var oActivity 	= this.oPage.getActivityByScoringUID(this.oPage.getGUID()+'~'+aActivity[i]).activity;
            var $view 		= oActivity.getView();
            var $btnSubmit 	= $view.find('#'+ oActivity.getQuestionID()+'_submit');  
            $btnSubmit.css({
            'width': '1px',
            'height': '1px',
            'position': 'fixed',
            'left': '0px',
            'bottom': '0px',
            'opacity': '0',
            'visible': 'none' 
            });
            nMaxPossibleScore += oActivity.getMaxPossibleScore();
            oActivity.addEventListener('SUBMIT_ENABLED', this.ActivityHandleEvent);
        }
        this.oDataModel.setMaxPossibleScore(nMaxPossibleScore);
    
        this.$btnSubmit = $('#' + this.getQuestionID() + '_submit');
        this.$btnReset = this.$domView.find('.btn-reset').attr('id',this.getQuestionID() + '_reset');
		//Validate Submit button
		if(this.$btnSubmit.length === 0){
            Logger.logError('MultiActivity._populateLayout() | ERROR: "Submit" button not found. A button with id "' + this.getQuestionID() + '_submit" and class "btn-submit" needs to exist within the Activity container');
		}

		//Initialize Submit Button
		this.$btnSubmit.click(function(e){
			e.preventDefault();
			if(oScope.isBtnActive(this)){
				e.type = 'SUBMIT';
				oScope._handleEvents(e);
				 oScope.enableReset(true); 
			}
		});
		//Initialize Reset Button
        this.$btnReset.click(function(e) {
            e.preventDefault();
			if(oScope.isBtnActive(this)){
				e.type = 'RESET';
				oScope._handleEvents(e);
				oScope.enableReset(false);
			}
        });
        
        oScope.enableReset(false);
		if(this.oDataModel.oDataModel._hasResetBtn === "true") {
			oScope.$btnReset.removeClass("hide");
	        this.enableReset(false);
		}
		this.enableSubmit(false);
		this.dispatchEvent("ACTIVITY_LOADED", {target:this, type:'ACTIVITY_LOADED', GUID:this.sGUID, eventID:this.sEventID, incidentID:this.sIncidentID});
	};


	MultiActivity.prototype._handleEvents							= function(e){
		if(e.type === 'SUBMIT'){
		    this._evaluate();
		}else if(e.type === 'RESET'){
			this.reset();	
		}
		
	     this.dispatchEvent(e.type, oEvent);
	};
	
	MultiActivity.prototype.ActivityHandleEvent							= function(e){
		//Logger.logDebug("MultiActivity._handleEvents() | ");
		if(typeof e.preventDefault == 'function'){e.preventDefault();}
		var oScope = this;
		var target			= e.target,
			currentTarget	= e.currentTarget,
			type			= e.type,
			oEvent;

		//Logger.logDebug('\tType = '+type+' : Target = '+target);
		switch(type){
			case 'OPTION_SELECT':
				break;
			case 'SUBMIT_ENABLED':
                oScope._checkAndEnableSubmit(e);
				break;
			case 'CONTINUE':

				break;
		}
	};

	MultiActivity.prototype._checkAndEnableSubmit					= function(e){
        this.enableSubmit(false);
       
        var aActivity = this.oDataModel.getDependencyList();
        for(var i= 0; i<aActivity.length;i++){
            var oActivity = this.oPage.getActivityByScoringUID(this.oPage.getGUID()+'~'+aActivity[i]).activity;
            if(!oActivity.isSubmitEnabled()){
                return;
            }
        };
       this.enableSubmit(true);
      
	};


	MultiActivity.prototype._evaluate								= function(){
	
		this.disableActivity();
		this.enableSubmit(false);
		this.oDataModel.updateAttempNumber();
		
		var aSelection = [];
	       var nScore = 0;
		var aActivity = this.oDataModel.getDependencyList();
		for(var i= 0; i<aActivity.length;i++){
            var oActivity =this.oPage.getActivityByScoringUID(this.oPage.getGUID()+'~'+aActivity[i]).activity;
            oActivity._evaluate();
            nScore += oActivity.getScore().getScore();
            this.aActivityData.push(oActivity.isCorrect().toString());
            aSelection.push(oActivity.getUserSelections())
        };
        
       this.updateScoreAndUserSelections(aSelection, nScore);
      	//	ComponentAbstract.prototype._evaluate.call(this);
		
		



	};

    MultiActivity.prototype.updateScoreAndUserSelections          = function(oUserSelections, p_nScore){
        //Logger.logDebug("MCQ.updateScoreAndUserSelections() | "+oSelectedOptionData);
        
        
            oScope          = this,
            oEvent          = {
                type            : 'SCORE_UPDATE',
                target          : oScope,
                preventDefault  : false,
                callback        : oScope.updateHistory,
                args            : []
            };

        ComponentAbstract.prototype.updateScoreAndUserSelections.call(this, p_nScore, oUserSelections);

        this.dispatchEvent('SCORE_UPDATE', oEvent);
        if (!oEvent.preventDefault) {
            this.updateHistory([oUserSelections]);
        }
    };

   /**
     *  Last updated- Sachin tumbre(12/22/2014) added loop feedbacks in history
     */
    MultiActivity.prototype.updateHistory                 = function(p_aSelectedOption) {
        this.oDataModel.getFeedback(true);
        var oScope  = this,
            oEvent  = {
                type            : 'HISTORY_UPDATE',
                target          : oScope,
                preventDefault  : false,
                callback        : oScope.processFeedbackPopup,
                args            : []
            };

        this.dispatchEvent('HISTORY_UPDATE', oEvent);
        if(!oEvent.preventDefault){this.processFeedbackPopup();}
    };


	MultiActivity.prototype.disableActivity						= function(){
		//Logger.logDebug('MultiActivity.disableActivity'+ this.aMultiActivityList.length);
		var aActivity = this.oDataModel.getDependencyList();
		for(var i=0; i<aActivity.length; i++){
			var oActivity = this.oPage.getActivityByScoringUID(this.oPage.getGUID()+'~'+aActivity[i]).activity;
			oActivity.removeEventListener('SUBMIT_ENABLED', this.ActivityHandleEvent);
			oActivity.disableActivity();
		}
		this.enableSubmit(false);
	};

	MultiActivity.prototype.enableActivity						= function(){
		//Logger.logDebug('MultiActivity.disableActivity'+ this.aMultiActivityList.length);
		var aActivity = this.oDataModel.getDependencyList();
		for(var i=0; i<aActivity.length; i++){
			var oActivity = this.oPage.getActivityByScoringUID(this.oPage.getGUID()+'~'+aActivity[i]).activity;
			if(!oActivity.hasEventListener('SUBMIT_ENABLED' , this.ActivityHandleEvent)){
				oActivity.addEventListener('SUBMIT_ENABLED', this.ActivityHandleEvent);				
			}
		}
		this.enableSubmit(false);
	};
	
	MultiActivity.prototype.reset							= function(){
		//Logger.logDebug('MultiActivity.resetOptions() | '+this);
		var aActivity = this.oDataModel.getDependencyList();
        for(var i=0; i<aActivity.length; i++){
        	var sScoringID 	= this.oPage.getGUID()+'~'+aActivity[i];
        	var oData		= this.oPage.getActivityByScoringUID(sScoringID);
            var oActivity 	= oData.activity;
            oActivity.resetScore();
            oActivity.resetAttemptNumber();
            oActivity.resetOptions();
            this.oPage.resetActivity(aActivity[i]);
        }
        this.resetAttemptNumber();
        this.resetOptions();
//        this.enableActivity();
	};
	
	MultiActivity.prototype.resetOptions							= function(){
		//Logger.logDebug('MultiActivity.resetOptions() | '+this);
		var aActivity = this.oDataModel.getDependencyList();
        for(var i=0; i<aActivity.length; i++){
            var oActivity = this.oPage.getActivityByScoringUID(this.oPage.getGUID()+'~'+aActivity[i]).activity;
           
           if(!oActivity.hasEventListener('SUBMIT_ENABLED' , this.ActivityHandleEvent)){
				oActivity.addEventListener('SUBMIT_ENABLED', this.ActivityHandleEvent);				
			}
            oActivity.resetOptions();
        }
        this.aActivityData = [];
		this.enableSubmit(false);
	};

	MultiActivity.prototype.enableSubmit							= function(p_bEnable){
		if(p_bEnable) {
			this.$btnSubmit.removeClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled'	: false
				/* END - ARIA Implementation */
			});
            this.$btnSubmit.removeAttr("disabled");

		}else{
			this.$btnSubmit.addClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled'	: true
				/* END - ARIA Implementation */
			});
            this.$btnSubmit.attr("disabled", "true");
		}
	};

	MultiActivity.prototype.openFeedbackPopup						= function (sFeedbackTitle, sFeedback) {
        var oTransitionPopup = this.openPopup('feedback', sFeedbackTitle, sFeedback, $('.btn-submit'));

	    oTransitionPopup.setCallback(this, this.checkAndResetOptions);

	};

	MultiActivity.prototype.checkAndResetOptions					= function (p_oPopup, p_oArgs) {
		//Logger.logDebug("MultiActivity.checkAndResetOptions() | \n\tis Attempts Completed = "+this.isAttemptsCompleted());
		
		if (this.isAttemptsCompleted()) {	
    		 // var aActivity = this.oDataModel.getDependencyList();   
			// for(var i=0; i<aActivity.length; i++){
                // var oActivity = this.oPage.getActivityByScoringUID(this.oPage.getGUID()+'~'+aActivity[i]).activity;
                // oActivity.removeEventListener('SUBMIT_ENABLED', this.ActivityHandleEvent);
            // }
			this._activityCompleted();
			
	    }else{
	        var aActivity = this.oDataModel.getDependencyList();
            for(var i=0; i<aActivity.length; i++){
                var oActivity = this.oPage.getActivityByScoringUID(this.oPage.getGUID()+'~'+aActivity[i]).activity;
                oActivity.addEventListener('SUBMIT_ENABLED', this.ActivityHandleEvent);
                oActivity.resetOptions();
                oActivity.resetScore();
            }
            this.resetScore();
            //this.updateAttempNumber();
	    }
	    this.aActivityData = [];
		 ComponentAbstract.prototype.checkAndResetOptions.call(this, p_oArgs);
	   
	};
	
	 MultiActivity.prototype.isAttemptsCompleted = function() {
         var correct  = (this.aActivityData.indexOf("false") === -1)
         if(!correct){
             correct = (this.oDataModel.getCurrentAttempt() === this.oDataModel.getTotalAttempts());
         }
        return correct;
    };
	
	MultiActivity.prototype.enableReset = function(p_bEnable) {
		if(this.oDataModel.oDataModel._hasResetBtn != "true")return;
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
	MultiActivity.prototype.destroy								= function(){
		this.$btnSubmit.off();
		ComponentAbstract.prototype.destroy.call(this);
		this.prototype			= null;
	};

	MultiActivity.prototype.toString 								= function(){
		return 'framework/activity/MultiActivity';
	};

	return MultiActivity;
});
