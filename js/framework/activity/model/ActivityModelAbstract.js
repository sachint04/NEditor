'use strict'
/**
 * @exports framework/activity/model/ActivityModelAbstract
 */
define([
	'x2js',
	'framework/core/feedback/FeedbackManager',
	'framework/core/feedback/Feedback',
	'framework/core/feedback/FeedbackParameterBased',
	'framework/core/feedback/FeedbackPercentageBased',

	'framework/core/score/ScoreManager',
	'framework/core/score/Score',
	'framework/core/score/ParameterizedScore',
	'framework/core/score/GlobalParameterizedScore',

	'framework/simulation/core/SIMScoreManager',
	'framework/simulation/core/SIMScore',

	'framework/utils/EventDispatcher',
	'framework/utils/Logger'
], function(X2JS, FeedbackManager, Feedback, FeedbackParameterBased, FeedbackPercentageBased, ScoreManager, Score, ParameterizedScore, GlobalParameterizedScore, SIMScoreManager, SIMScore, EventDispatcher, Logger){
	/**
	* Supper to all Activity Models (framework/activity/model/) 
	* @constructor
	* @alias ActivityModelAbstract
	*/
	function ComponentModelAbstract(p_xmlActivityNode, p_sGUID,  p_sScoringID){
		//Logger.logDebug('ComponentModelAbstract.CONSTRUCTOR() ');
		EventDispatcher.call(this);
		this.oDataModel;
		this.bIsSimulation;
		this.sScoringUID 		= p_sScoringID;
		this.sGUID 			= p_sGUID;
		this.activityXMLNode = p_xmlActivityNode;
		this.nCurrentAttempt = 0;
		this.oScore;

	}

	ComponentModelAbstract.prototype												= Object.create(EventDispatcher.prototype);
	ComponentModelAbstract.prototype.constructor									= ComponentModelAbstract;
	
	/**
	* Load dependent assets (i.e. isap.xml) before starting activity initialization  
	* 
	*/
	ComponentModelAbstract.prototype.loadDependencies								= function(){
		//Logger.logDebug('ComponentModelAbstract.loadDependencies()  Model is ready with data');
		this._createDataModel(this.activityXMLNode);
		this.dispatchEvent('MODEL_READY',{target:this, type:'MODEL_READY'});
	};
	
	ComponentModelAbstract.prototype._createDataModel								= function(p_xml){
		if(p_xml.nodeType){
			var oX2JS = new X2JS();
			this.oDataModel = oX2JS.xml2json(p_xml);
			//Logger.logDebug('ComponentModelAbstract._createDataModel() | '+JSON.stringify(this.oDataModel));
		}else{
			Logger.logError('_createDataModel() | Invalid Parameter. '+(p_xmlActivityNode.nodeType));
		}
	};
	

	ComponentModelAbstract.prototype.updateDataModel								= function(p_xml){
		//	//Logger.logDebug('ComponentAbstract.ComponentModelAbstract() '+p_xml.nodeType);
		if(p_xml.nodeType){
			var oX2JS = new X2JS();
			this.oDataModel = oX2JS.xml2json(p_xml);
			//Logger.logDebug('ComponentModelAbstract.updateDataModel() | '/*+JSON.stringify(this.oDataModel)*/);
			this.dispatchEvent('MODE_DATAL_UPDATE', {type:'MODE_DATAL_UPDATE', target:this});
		}else{
			Logger.logError('ComponentModelAbstract.updateDataModel() | Invalid Parameter. '+(p_xmlActivityNode.nodeType));
		}
	};
	
	/**
	 * Retuns "pageTexts" node from "activity" node 
	 * @returns {Object} 
	 */
	ComponentModelAbstract.prototype.getPageTextCollection							= function(){
		return this.oDataModel.pageTexts || null;
	};

	ComponentModelAbstract.prototype.checkFeedBackTypeAndInitializeScore			= function(){
		/* Sachin Tumbre(12/03/2014) - Incase of bookmarking score object will be created by BookmarkManager. Hence do not create one */
		this.oScore 	=  ScoreManager.getScore(this.sScoringUID);
		if(this.oScore ){
			if(this.oDataModel._bookmark !== "true"){
				this.oScore.reset();				
			}
			return;
		}
		var sFeedbackType = this.getFeedbackType().toUpperCase();
		//Logger.logDebug('ComponentModelAbstract.checkFeedBackTypeAndInitializeScore() | sFeedbackType = '+sFeedbackType+' : '+this.bIsSimulation);
		switch(sFeedbackType.toUpperCase()){
			case "CORRECTINCORRECT" :
				this.oScore = (this.bIsSimulation) ? new SIMScore(this.sScoringUID) : new Score(this.sScoringUID);
				break;
			case "CORRECTINCORRECTATTEMPTSPECIFIC":
				this.oScore = (this.bIsSimulation) ? new SIMScore(this.sScoringUID) : new Score(this.sScoringUID);
				break;
			/*case "CORRECTINCORRECTSPECIFIC":
				this.oScore = (this.bIsSimulation) ? new SIMScore(this.sScoringUID) : new Score(this.sScoringUID);
				break;*/
			case "CORRECTINCORRECTPARTIAL" :
				this.oScore = (this.bIsSimulation) ? new SIMScore(this.sScoringUID) : new Score(this.sScoringUID);
				break;
			case "CORRECTINCORRECTPARTIALATTEMPTSPECIFIC" :
				this.oScore = (this.bIsSimulation) ? new SIMScore(this.sScoringUID) : new Score(this.sScoringUID);
				break;
			/*case "CORRECTINCORRECTOPTIONSPECIFIC" :*/
			case "OPTIONSPECIFIC" :
				this.oScore = (this.bIsSimulation) ? new SIMScore(this.sScoringUID) : new Score(this.sScoringUID);
				break;
			case "OPTIONANDATTEMPTSPECIFIC" :
				this.oScore = (this.bIsSimulation) ? new SIMScore(this.sScoringUID) : new Score(this.sScoringUID);
				break;
			case "PARAMETERBASEDFEEDBACK" :
			case "PARAMETERBASEDFEEDBACKCORRECTINCORRECT" :
			case "PARAMETERBASEDFEEDBACKOPTIONSPECIFIC" :
			case "PARAMETERBASEDFEEDBACKCORRECTINCORRECTPARTIALATTEMPTSPECIFIC" :
			case "PARAMETERBASEDFEEDBACKCORRECTINCORRECTATTEMPTSPECIFIC" :
				this.oScore = new ParameterizedScore(this.sScoringUID);
				var fbParamPointer	= (this.oDataModel.Root) ? this.oDataModel.Root.SCENARIO.FEEDBACKPARAMETER : this.oDataModel.FEEDBACKPARAMETER,
				fbparamCount	= fbParamPointer.length;
				if(fbparamCount){
						this.oScore.initializeParameterList(fbParamPointer[0].PARAMETER);
				}else{
					 this.oScore.initializeParameterList(fbParamPointer.PARAMETER);
					
				}
				break;
				/* Sachin Tumbre(12/03/2014) - Added new Score type*/
			case "GLOBALPARAMETERBASEDFEEDBACK" :
			case "GLOBALPARAMETERBASEDFEEDBACKCORRECTINCORRECT" :
			case "GLOBALPARAMETERBASEDFEEDBACKOPTIONSPECIFIC" :
			case "GLOBALPARAMETERBASEDFEEDBACKCORRECTINCORRECTPARTIALATTEMPTSPECIFIC" :
			case "GLOBALPARAMETERBASEDFEEDBACKCORRECTINCORRECTATTEMPTSPECIFIC" :
				this.oScore = GlobalParameterizedScore.createScore(this.sScoringUID);
				var fbParamPointer	= (this.oDataModel.Root) ? this.oDataModel.Root.SCENARIO.FEEDBACKPARAMETER : this.oDataModel.FEEDBACKPARAMETER,
						fbparamCount	= fbParamPointer.length;
				if(fbparamCount){
					GlobalParameterizedScore.initializeParameterList(this.sScoringUID, fbParamPointer[0].PARAMETER);
				}else{
					GlobalParameterizedScore.initializeParameterList(this.sScoringUID, fbParamPointer.PARAMETER);
				}
				break;
			case "PERCENTAGEBASEDFEEDBACK" :
				this.oScore = (this.bIsSimulation) ? new SIMScore(this.sScoringUID) : new Score(this.sScoringUID);
				break;
		}

		if(this.oScore){
			var bScorable = this.bIsSimulation ? true : (this.oDataModel._scorable != undefined && this.oDataModel._scorable.toUpperCase() === "TRUE");
			this.oScore.setScorable(bScorable);
			(this.bIsSimulation) ? SIMScoreManager.addScore(this.oScore) : ScoreManager.addScore(this.oScore);
		}
	};

	ComponentModelAbstract.prototype.checkFeedBackTypeAndInitializeFeedback			= function(){
		var sFeedbackType = this.getFeedbackType().toUpperCase();
		switch(sFeedbackType){
			case "CORRECTINCORRECT" :
				this.oFeedback = new Feedback(sFeedbackType, this.getActivityType(), this.sScoringUID);
				break;
			case "CORRECTINCORRECTATTEMPTSPECIFIC":
				this.oFeedback = new Feedback(sFeedbackType, this.getActivityType(), this.sScoringUID);
				break;
			/*case "CORRECTINCORRECTSPECIFIC":
				this.oFeedback = new Feedback(sFeedbackType, this.getActivityType(), this.sScoringUID);
				break;*/
			case "CORRECTINCORRECTPARTIAL" :
				this.oFeedback = new Feedback(sFeedbackType, this.getActivityType(), this.sScoringUID);
				break;
			case "CORRECTINCORRECTPARTIALATTEMPTSPECIFIC" :
				this.oFeedback = new Feedback(sFeedbackType, this.getActivityType(), this.sScoringUID);
				break;
			case "OPTIONSPECIFIC" :
				this.oFeedback = new Feedback(sFeedbackType, this.getActivityType(), this.sScoringUID);
				break;
			case "OPTIONANDATTEMPTSPECIFIC" :
				this.oFeedback = new Feedback(sFeedbackType, this.getActivityType(), this.sScoringUID);
				break;
			case "PARAMETERBASEDFEEDBACK" :
			case "PARAMETERBASEDFEEDBACKCORRECTINCORRECT" :
			case "PARAMETERBASEDFEEDBACKOPTIONSPECIFIC" :
			case "PARAMETERBASEDFEEDBACKCORRECTINCORRECTPARTIALATTEMPTSPECIFIC" :
			case "PARAMETERBASEDFEEDBACKCORRECTINCORRECTATTEMPTSPECIFIC" :
			case "GLOBALPARAMETERBASEDFEEDBACK" :
			case "GLOBALPARAMETERBASEDFEEDBACKCORRECTINCORRECT" :
			case "GLOBALPARAMETERBASEDFEEDBACKOPTIONSPECIFIC" :
			case "GLOBALPARAMETERBASEDFEEDBACKCORRECTINCORRECTPARTIALATTEMPTSPECIFIC" :
			case "GLOBALPARAMETERBASEDFEEDBACKCORRECTINCORRECTATTEMPTSPECIFIC" :
				this.oFeedback		= new FeedbackParameterBased(sFeedbackType, this.getActivityType(), this.sScoringUID);
				var fbParamPointer	= (this.oDataModel.Root) ? this.oDataModel.Root.SCENARIO.FEEDBACKPARAMETER : this.oDataModel.FEEDBACKPARAMETER,
					fbparamCount	= fbParamPointer.length;
				// ** TODO: Check "initializeParameterList" for any issues
				if(fbparamCount){
					this.oFeedback.initializeParameterList(fbParamPointer[0].PARAMETER);
				}else{
					this.oFeedback.initializeParameterList(fbParamPointer.PARAMETER);
				};
				break;
			case "PERCENTAGEBASEDFEEDBACK" :
				this.oFeedback = new FeedbackPercentageBased(sFeedbackType, this.getActivityType(), this.sScoringUID);
				break;
		}
		//Logger.logDebug('checkFeedBackTypeAndInitializeFeedback(() sFeedbackType = '+ sFeedbackType+ ' | this.oFeedback = '+ this.oFeedback);
		if(this.oFeedback){
			FeedbackManager.addFeedback(this.oFeedback);
		}
	};

	/**
	 *	Returns scoring UID for current activity i.e. cw01~cw01~pg01~mcq_1
	 * @returns {String} 
	 */
    ComponentModelAbstract.prototype.getScoringUID 									= function() {
        return this.sScoringUID;
    };
    
    ComponentModelAbstract.prototype.setScoringUID 									= function(p_sScoringUID) {
        this.sScoringUID = p_sScoringUID;
    };
    
    ComponentModelAbstract.prototype.setIsSimulation 								= function(p_bIsSimulation) {
        this.bIsSimulation = p_bIsSimulation;
    };

    ComponentModelAbstract.prototype.setScore 										= function(p_nScore) {
        this.oScore.setScore(p_nScore);
    };
    
    ComponentModelAbstract.prototype.setMaxPossibleScore 							= function(p_nMaxPossibleScore) {
    	//Logger.logDebug('ComponentModelAbstract.setMaxPossibleScore() this.oScore = '+ this.oScore);
        this.oScore.setMaxPossibleScore(p_nMaxPossibleScore);
    };
    
    ComponentModelAbstract.prototype.setUserScores 									= function(p_aUserScore) {
        this.oScore.setUserScores(p_aUserScore);
    };
    
    ComponentModelAbstract.prototype.setUserSelections 								= function(p_aUserSelections) {
        this.oScore.setUserSelections(p_aUserSelections);
    };
    //to set total score of all assessment questions
   
    ComponentModelAbstract.prototype.updateMaxPossibleScore 						= function(p_nMaxPossibleScore) {
      this.oScore.updateMaxPossibleScore(p_nMaxPossibleScore);
   };
	
	ComponentModelAbstract.prototype.getMaxPossibleScore						    = function(){
		return this.oScore.getMaxPossibleScore();
	};
	
	ComponentModelAbstract.prototype.getUserScores								    = function(){
		return this.oScore.getUserScores();
	};
	
	ComponentModelAbstract.prototype.getUserSelections							    = function(){
		return this.oScore.getUserSelections();
	};
   
 	/* p_Score - Can be a Number or a Parameter X2JS Object */
	ComponentModelAbstract.prototype.updateScore									= function(p_score){
		var sFeedbackType = this.getFeedbackType().toUpperCase();
		//Logger.logDebug('ComponentModelAbstract.updateScore | p_score = '+JSON.stringify(p_score));
		
		if(sFeedbackType.indexOf("GLOBALPARAMETERBASED") != -1 ){
			GlobalParameterizedScore.updateScore(p_score);		
		}else{
			this.oScore.updateScore(p_score);			
		}
	};
	
	ComponentModelAbstract.prototype.updateUserScores								= function(p_nUserScore){
		this.oScore.updateUserScores(p_nUserScore);
	};
	
	ComponentModelAbstract.prototype.updateUserSelections	    					= function(p_sUserSelection){
		//Logger.logDebug('ComponentModelAbstract.updateUserSelections() | '+JSON.stringify(p_sUserSelection));
		this.oScore.updateUserSelections(p_sUserSelection);
	};

	/* Feedback History */
	ComponentModelAbstract.prototype.updateFeedbackHistory							= function(p_userSelection, p_nIndex){
		//Logger.logDebug('ComponentModelAbstract.updateFeedbackHistory() | \n\tUser Selection = '+JSON.stringify(p_userSelection)+' : Index = '+p_nIndex);
		var oHistory			= this.getHistory(p_userSelection);
		//Logger.logDebug('\toHistory = '+JSON.stringify(oHistory));
		if(oHistory){
			this.oFeedback.updateHistory(oHistory, p_nIndex);
		}
		//Logger.logDebug('\tHistory UPDATED');
	};

	// ** STUB Method to be overiden by the Final Component Model Class
	ComponentModelAbstract.prototype.getHistory										= function(p_userSelection){
		Logger.logError('ComponentModelAbstract.getHistory() | ERROR: The Final Component Model Class Needs to implement the "getHistory" method.');
	};

	ComponentModelAbstract.prototype.getQuestionText								= function(p_userSelection){
		//Logger.logDebug('ComponentModelAbstract.getQuestionText() |');
		var aPageTexts		= this.getPageTexts(),
			x2jsPageTextPointer,
			sPageTextID,
			sPageTextClassName,
			sQuestionText;
		/*
		 * Check if a "pageText" node with an attribute 'class' OR 'id' as 'question'
		 */
		if(aPageTexts.length){
			for (var i=0; i < aPageTexts.length; i++) {
				x2jsPageTextPointer	= aPageTexts[i];
				sPageTextID			= x2jsPageTextPointer._id;
				sPageTextClassName	= x2jsPageTextPointer._class;

				if(sPageTextID && sPageTextID.toUpperCase() === 'QUESTION'){
					sQuestionText = x2jsPageTextPointer.__cdata;
					break;
				}
				if(sPageTextClassName && sPageTextClassName.toUpperCase() === 'QUESTION'){
					sQuestionText = x2jsPageTextPointer.__cdata;
					break;
				}
			};
		}

		return sQuestionText;
	};

	ComponentModelAbstract.prototype.updateAttempNumber								= function(){
		this.nCurrentAttempt++;
	};

	ComponentModelAbstract.prototype.getScore								 	   	= function(){
		return this.oScore;
	};

	ComponentModelAbstract.prototype.getCurrentAttempt							    = function(){
		return this.nCurrentAttempt;
	};

    /**
     * Returns acitity Type
     * Returns {String}
     */
    ComponentModelAbstract.prototype.getActivityType 								= function() {
        return this.oDataModel._type;
    };
    
    /**
     * Returns question ID i.e. mcq_1 
     */
    ComponentModelAbstract.prototype.getQuestionID 									= function() {
        return this.oDataModel._questionId;
    };
    
    /**
     * Returns total attempts allowed 
     */
    ComponentModelAbstract.prototype.getTotalAttempts 								= function() {
        return (this.oDataModel._totalAttempts == "") ? 0 : parseInt(this.oDataModel._totalAttempts);
    };
    
    ComponentModelAbstract.prototype.getCorrectAnswers 								= function() {
        return this.oDataModel._correctAnswer.split(',');
    };
    
    /**
     * Returns Feedback type  i.e. CORRECTINCORRECT
     * @returns {String} 
     */
    ComponentModelAbstract.prototype.getFeedbackType 								= function() {
    	//Logger.logDebug('ComponentModelAbstract.getFeedbackType() '+ JSON.stringify(this.oDataModel));
		//alert("CD__this.oDataModel._fbType :: " + this.oDataModel._fbType);
        return this.oDataModel._fbType;
    };
	
	/**
	 * Returns true if activit has reset button 
	 * Returns {Boolean}
	 */
    ComponentModelAbstract.prototype.hasReset 										= function() {
        return (this.oDataModel._resetBtn === "true");
    };

	/**
	 * Returns true if activit has show Answer button 
	 * Returns {Boolean}
	 */
    ComponentModelAbstract.prototype.hasShowAns 									= function() {
        return (this.oDataModel._answerBtn === "true");
    };
	
	/**
	 * Returns "pageTexts" node object(JSON)
	 *  @returns {Objct}
	 */
    ComponentModelAbstract.prototype.getPageTexts 									= function() {
        return this.oDataModel.pageTexts.pageText;
    };

	ComponentModelAbstract.prototype._generateFeedback								= function(){
		var blnCorrect  		= (this.oScore.getPercentScore() === 100) ? true : false,
		    aUserSelections		= this.oScore.getUserSelections(),
			sFeedbackType		= this.getFeedbackType().toUpperCase(),
		    x2jsFeedback		= this._getFeedbackNode(sFeedbackType),
			i;
		//Logger.logDebug('ComponentModelAbstract._generateFeedback() | '+aUserSelections.length);
		//alert("CD__x2jsFeedback :: " + x2jsFeedback);
		this.oFeedback.processFeedback(x2jsFeedback, this.oScore);

		// ** Populating History in Feedback Object
		for (var i=0; i < aUserSelections.length; i++) {
			// ** @ userSelection : This could be a STRING, ARRAY or OBJECT. Example: String in case of MCQ, Array in case of Conversation
			var userSelection	= aUserSelections[i];
			// ** The method named "getHistory" needs to be implemented by all Final Data Models
			//Logger.logDebug('\tUser Selection = '+JSON.stringify(userSelection));
			this.updateFeedbackHistory(userSelection, i);
		};

		var o	= {};
		this.getOptionalData(o);

		//Logger.logDebug('ComponentModelAbstract.setOptionalData() | '+JSON.stringify(o));
		this.oFeedback.setOptionalData(o || {});


		return this.oFeedback;
	};

	ComponentModelAbstract.prototype.getOptionalData								= function(p_oOptionalData){
		p_oOptionalData.pageText = this.getPageTexts();
		return p_oOptionalData;
	};
	
	ComponentModelAbstract.prototype.getFeedback									= function(p_bGenerateFeedback){
		//Logger.logDebug("ComponentModelAbstract.getFeedback() | p_bGenerateFeedback = "+p_bGenerateFeedback+' : History Length = '+this.oFeedback.getHistory());
		if(p_bGenerateFeedback || this.oFeedback.getHistory().length === 0){
			this._generateFeedback();
		}
		return this.oFeedback;
	};

	ComponentModelAbstract.prototype._getFeedbackNode								= function(p_fbType){
		var sFBtype				= p_fbType.toUpperCase(),
			bAttemptSpecific	= false,
			oFbkPointer			= this.oDataModel.feedbacks.feedback;
		
		 if(sFBtype.indexOf('PARAMETERBASED')  != -1){
			return {feedbackStrand:this.oDataModel.FEEDBACKSTRANDS.FEEDBACK,
				feedbackParameter: this.oDataModel.FEEDBACKPARAMETER};	
		}
		
        // ** TODO: Handle other feedback types that might be sent in
        // ** Correct Incorrect Partial
        if (sFBtype.indexOf('CORRECTINCORRECT') > -1) {
            if (sFBtype.indexOf('PARTIAL') > -1 && this.isPartiallyCorrect()) {
                sFBtype = "PARTIAL";
            } else {
                sFBtype = (this.isCorrect()) ? "CORRECT" : "INCORRECT";
            }
        }
        // ** Option Specific (Applicable ONLY for MCQ)
        if (sFBtype.indexOf('OPTION') > -1) {
            sFBtype = "OPTIONSPECIFIC";
        }
        // ** Attempt Specific
        if (p_fbType.toUpperCase().indexOf('ATTEMPTSPECIFIC') > -1) {
            bAttemptSpecific = true;
        }
		
		//alert("CD__FbkPointer.length bappa :: " + oFbkPointer[0]);

		for (var i = 0; i < oFbkPointer.length; i++) {
			/*for (j in oFbkPointer[i]){
				alert(oFbkPointer[i][j])
			}*/
			
            var oFBPointer = oFbkPointer[i];
            //Logger.logDebug('oFBPointer._fbType.toUpperCase() = '+ oFBPointer._fbType.toUpperCase());
            if (oFBPointer._fbType.toUpperCase() === sFBtype) {
                // ** If the Feedback Type id Option Specific
                if (sFBtype === 'OPTIONSPECIFIC') {
					//alert("CD__oFBPointer._optionID :: " + oFBPointer._optionID);
                    // TODO: For applying specific feedbacks to ALL Activities, User selections need to be standrdized.
                    // This implementation is specific to MCQ Activity
                    if (oFBPointer._optionID !== this.oScore.getUserSelections()[0].optionID) {
						continue;
                    } else {
						return oFBPointer;
					}
					//alert("CD__oFBPointer :: " + oFBPointer);
                } else {
                    // ** If Attempt Specific & Current Attempt matches the Node's Attempt
                    if (bAttemptSpecific && (parseInt(oFBPointer._attempt) === this.nCurrentAttempt)) {
                        return oFBPointer;
                    } else if (!bAttemptSpecific) {
                        return oFBPointer;
                    }
                }
                //return this.sanitizeFeedback(this.oDataModel.feedbacks.feedback[i]);
            }
        }
       
        // ** TODO
        Logger.logError('ERROR: No feedback with type "' + p_fbType + '" found in Model.');
    };
    
	ComponentModelAbstract.prototype.isCorrect 										= function() {
       	/* Sachin Tumbre(12/03/2014) - */
	if(this.getFeedbackType().toUpperCase().indexOf('PARAMETERBASED')  === -1){
	       	var aUserScore 				= this.oScore.getUserScores();
        	for (var i = 0; i < aUserScore.length; i++) {
	            if (aUserScore[i] < 1) {
	                return false;
	            }
        	} 
        } 
        var score 	= this.oScore.getScore(), 
        maxScore	= this.oScore.getMaxPossibleScore();
        return ( score === maxScore );
    };
	
    ComponentModelAbstract.prototype.isPartiallyCorrect 							= function() {
        var aUserScore = this.oScore.getUserScores();
        if (this.isCorrect()) {
            return false;
        }
        for (var i = 0; i < aUserScore.length; i++) {
            if (aUserScore[i] > 0) {
                return true;
            }
        }
        return false;
    };

    ComponentModelAbstract.prototype.isShowFeedbackPopup 							= function() {
        return (this.oDataModel._showFeedbackPopup === 'true');
    };
    
    ComponentModelAbstract.prototype.hasImmediateFeedback 							= function() {
        return (this.oDataModel._immediateFeedback === 'true');
    };
    
    /**
     * Display tick and cross for correct and user selected incorrect options 
     */
    ComponentModelAbstract.prototype.displayTickCross 								= function() {
        return (this.oDataModel._displayTickCross === 'true');
    };
    
    /**
     * Returns tick cross display event trigger i.e. defaul ,  Submit
     * If type is set to 'Submit' in acivity node, tickcross will be displayed imidiatly after submit button clicked
     * In case of 'default' tick cross will be display after feedback popupclosed
     * @returns {String} 
     */
    ComponentModelAbstract.prototype.getTickCrossDisplayTrigger 					= function() {
        return this.oDataModel._tickCrossTrigger || "default";
    };
    
    /** 
     * Reset attempt count 
     */
    ComponentModelAbstract.prototype.resetAttemptNumber 							= function() {
        this.nCurrentAttempt = 0;
    };
	
	/**
	 * Returns true if user has exosted all attemptes
	 * @returns {Boolean} 
	 */
    ComponentModelAbstract.prototype.isAttemptsCompleted 							= function() {
        if (this.isCorrect()) {
            return true;
        }
        var totalAttempts 			=	this.getTotalAttempts();
        return (this.nCurrentAttempt === totalAttempts);
    };
	
	/**
	 * Returns attribute value of 'activity' node  
 	* @param {Object} p_sKey
 	* @retusn {String}
	 */
	ComponentModelAbstract.prototype.getConfig										= function(p_sKey){
		return this.oDataModel['_'+p_sKey];	
	};
	
	ComponentModelAbstract.prototype.isArray		 								= function(p_Val){
		var isArray	= (p_Val.length) ? true : false;
		return isArray;
	};
	
	ComponentModelAbstract.prototype.destroy										= function(){
		this.oDataModel			= null;
		this.bIsSimulation		= null;
		this.sScoringUID		= null;
		this.sGUID 			= null;
		this.activityXMLNode 		= null;
		this.nCurrentAttempt 		= null;
		this.oScore 			 = null;
		EventDispatcher.prototype.destroy.call(this);
		this.prototype			= null;
	};
	
	ComponentModelAbstract.prototype.toString 										= function(){
		return 'framework/activity/model/ActivityModelAbstract';
	};

	return ComponentModelAbstract;
});