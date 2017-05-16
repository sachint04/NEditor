define([
	'framework/core/feedback/Feedback',
	'framework/core/feedback/ParameterFeedback',
	'framework/core/score/ParameterizedScore',
	'framework/core/score/ScoreManager',
	'framework/core/score/GlobalParameterizedScore',
	'framework/utils/Logger'
], function(Feedback, ParameterFeedback, ParameterizedScore, ScoreManager, GlobalParameterizedScore, Logger){
	function FeedbackParameterBased(p_sType, p_sActivityType, p_sQuestionID){
		//Logger.logDebug('FeedbackParameterBased.CONSTRUCTOR()');
		Feedback.call(this, p_sType, p_sActivityType, p_sQuestionID);

		this.sParameterPrefix		= 'parameter_';
		this.oGlobalFeedback;
		//this.aParameterFeedbackList = [];
		this.oParameterList;
		this.nParameterCount;
	};

	FeedbackParameterBased.prototype									= Object.create(Feedback.prototype);
	FeedbackParameterBased.prototype.constructor						= FeedbackParameterBased;

	FeedbackParameterBased.prototype.initializeParameterList			= function(p_aParameters){
		this.oParameterList		= {};
		this.nParameterCount	= p_aParameters.length;

		if(this.nParameterCount){
			for(i=0; i<this.nParameterCount; i++){
				var oParameterPointer	= p_aParameters[i],
					sParameterID		= oParameterPointer._ID;

				this.oParameterList[this.sParameterPrefix + sParameterID] = new ParameterFeedback(oParameterPointer);
			}
		}else{
			var oParameterPointer	= p_aParameters,
				sParameterID		= oParameterPointer._ID;

			this.oParameterList[this.sParameterPrefix + sParameterID] = new ParameterFeedback(oParameterPointer);
			this.nParameterCount = 1;
		}
	};

	// ** Overiding the Super Class method to accomodate the Parameter Based History update
	FeedbackParameterBased.prototype.updateHistory						= function(p_oHistoryCollection, p_nIndex){
		var oHistory					= p_oHistoryCollection.history,
			oParameterHistoryCollection	= p_oHistoryCollection.parameterHistory,
			sParameterID;
		//Logger.logDebug('FeedbackParameterBased.updateHistory() | '+JSON.stringify(p_oHistoryCollection));

		// ** Update the Super Class's History with the Regular History Object
		Feedback.prototype.updateHistory.call(this, oHistory, p_nIndex);
		//Logger.logDebug('FeedbackParameterBased.updateHistory() | '+JSON.stringify(Feedback.prototype.getHistory.call(this)));
		// ** Update the Parameter History
		for (sParameterID in oParameterHistoryCollection) {
			var oParameterHistory = oParameterHistoryCollection[sParameterID];
			this._updateParameterHistory(sParameterID, oParameterHistory, p_nIndex);
		};
	};
	FeedbackParameterBased.prototype.reset									= function(){
		this._resetParameterHistory();
		Feedback.prototype.reset.call(this);
	};

	// ** Overiding the Super Class method to accomodate the Parameter Based Feedback accumulation
	FeedbackParameterBased.prototype.processFeedback					= function(p_x2jsFeedback, p_oParameterizedScore){
		if(!p_oParameterizedScore instanceof ParameterizedScore && p_oParameterizedScore instanceof GlobalParameterizedScore){
			Logger.logError('FeedbackParameterBased.processFeedback() | ERROR: Invalid Score Object. It needs to be an Instance of the "ParameterizedScore" Object');
		}
		try{
		var oStrandList			= (p_x2jsFeedback.feedbackStrand) ?  p_x2jsFeedback.feedbackStrand.STRAND : p_x2jsFeedback.FEEDBACKSTRANDS.FEEDBACK.STRAND,
		nStrandCount		= oStrandList.length;
			
		}catch(e){
						
		}

		// ** Iterate the STRAND Nodes
		if (nStrandCount) {
			// ** Multiple STRAND child nodes
			for(i=0; i<nStrandCount; i++){
				var oStrandPointer			= oStrandList[i];
				this.processStrandAndUpdateFeedbacks(oStrandPointer, p_oParameterizedScore);
			}
		}else{
			// ** Only 1 STRAND child node
			this.processStrandAndUpdateFeedbacks(oStrandList, p_oParameterizedScore);
		}

		this.processOverallFeedback(p_x2jsFeedback);
	};

	/**
	 *  processOverallFeedback
	 */
	FeedbackParameterBased.prototype.processOverallFeedback			= function(p_x2jsFeedback){
		// //Logger.logDebug(this.toString()+' processOverallFeedback()');
		var i,j,str,aParamList,oParameterPointer,sParentParameterID,
		oScore 									= this.getScore(),
		oParamList 								= this.getParameterFeedbackList(),
		aFeebackParameterList 					= p_x2jsFeedback.feedbackParameter,
		oStrandList								= p_x2jsFeedback.feedbackStrand.STRAND;

		this.oGlobalFeedback 					= {score: oScore.getPercentScore()};

		// get parent Parameter ID
		//TODO: If incase of more than one parent parameter nodes(i.e. has valid 'AssociatedParameters' attribute), then
		// update below logic to handle the case
		if(aFeebackParameterList.length){
			for (i=0; i < aFeebackParameterList.length; i++) {
				var oFeedbackParameter 				= aFeebackParameterList[i];
			//	if(oFeedbackParameter._TYPE.toLowerCase() === 'conversation'){
					aParamList 					= oFeedbackParameter.PARAMETER;
					for (j=0; j < aParamList.length; j++) {
						oParameterPointer 		= aParamList[j];
						if(oParameterPointer._AssociatedParameters && oParameterPointer._AssociatedParameters.length > 0){
							sParentParameterID 		= oParameterPointer._ID;
							break;
						}

					}
					break;
			//	}
			}
		}else{
			aParamList 						= aFeebackParameterList.PARAMETER;
			for (j=0; j < aParamList.length; j++) {
				oParameterPointer 			= aParamList[j];
				if(oParameterPointer._AssociatedParameters && oParameterPointer._AssociatedParameters.length > 0){
					sParentParameterID 		= oParameterPointer._ID;
					break;
				}
			}
		}

		var nStrandCount = oStrandList.length;
		//Logger.logDebug(this.toString()+' processOverallFeedback()  nStrandCount = '+ nStrandCount);
		for (i=0; i < nStrandCount; i++) {
		  var oStrandPointer 		= oStrandList[i];
			//Logger.logDebug(this.toString()+" processOverallFeedback()  oStrandPointer._ID : "+oStrandPointer._ID +' | sParentParameterID = '+sParentParameterID);

			if(oStrandPointer._ID == sParentParameterID){
				var oParameterRange						= oStrandPointer.RANGE,
				nParameterRangeCount					= oParameterRange.length;
				//Logger.logDebug(this.toString()+ " processOverallFeedback() nParameterRangeCount : "+nParameterRangeCount);
				for (j=0; j < nParameterRangeCount; j++) {
					var oRange = oParameterRange[j];
					var sRangeName 						= oRange._NAME;
					var sScore 							= oRange._SCORE;
					var nRangeStart 					= parseInt(sScore.split(",")[0]);
					var nRangeEnd 						= parseInt(sScore.split(",")[1]);
					if(nRangeStart == 0 && isNaN(nRangeEnd)){
						nRangeEnd 						= 0;
					}
					if(nRangeStart === 100 && isNaN(nRangeEnd)){
						nRangeStart 					= 100;
						nRangeEnd 						= 100;
					}
					//Logger.logDebug(this.toString()+" processOverallFeedback()  nRangeStart : "+nRangeStart+" | nRangeEnd : "+nRangeEnd);
					if(Number(this.oGlobalFeedback.score) >= nRangeStart && Number(this.oGlobalFeedback.score)<= nRangeEnd){
					  	this.oGlobalFeedback.feedback 		= oRange.__cdata;
					  	this.oGlobalFeedback.title			= oRange._TITLE;
						//Logger.logDebug(this.toString()+" processOverallFeedback()  oFeedback.title :  "+ this.oGlobalFeedback.title +" | oFeedback.feedback :  "+ this.oGlobalFeedback.feedback);
						break;
				 	}
				};

			}
		};

	};

	
	FeedbackParameterBased.prototype.getGlobalFeedback					= function(){
		return this.oGlobalFeedback;
	};
	FeedbackParameterBased.prototype.getTitle								= function(){
		return this.oGlobalFeedback.title;
	};

	FeedbackParameterBased.prototype.getContent							= function(){
		return this.oGlobalFeedback.feedback;
	};
	FeedbackParameterBased.prototype.getParameterFeedbackList			= function(){return this.oParameterList;};

	FeedbackParameterBased.prototype.getParameterFeedbackByID			= function(p_sParameterID){
		var oParameterFeedback = this.oParameterList[this.sParameterPrefix + p_sParameterID];
		if(!oParameterFeedback || (!oParameterFeedback instanceof ParameterFeedback)){
			Logger.logError('FeedbackParameterBased.getParameterFeedbackByID() | ERROR: Parameter Feedback Object with ID "'+p_sParameterID+'" not found.');
		}
		return oParameterFeedback;
	};

	/*
	 * PRIVATE Methods
	 */
	FeedbackParameterBased.prototype._updateParameterHistory				= function(p_sParameterID, p_oParameterHistory, p_nIndex){
		var oParameterFeedback	= this.getParameterFeedbackByID(p_sParameterID);
		oParameterFeedback.updateHistory(p_oParameterHistory, p_nIndex);
		//Logger.logDebug('FeedbackParameterBased._updateParameterHistory() | '+JSON.stringify(oParameterFeedback.getHistory()));
	};
	FeedbackParameterBased.prototype._resetParameterHistory				= function(p_sParameterID, p_oParameterHistory, p_nIndex){
		for(var sParam in this.oParameterList){
			//Logger.logDebug('FeedbackParameterBased._resetParameterHistory() | sParam ID = '+sParam);
			this.oParameterList[sParam].reset();
		}
		//Logger.logDebug('FeedbackParameterBased.reset() | '+JSON.stringify(oParameterFeedback.getHistory()));
	};

	//FeedbackParameterBased.prototype.getParameterFeedback				= function(p_oStrand, p_oParameterizedScore){
	FeedbackParameterBased.prototype.processStrandAndUpdateFeedbacks	= function(p_oStrand, p_oParameterizedScore){
		var oStrandPointer			= p_oStrand,
			sParameterID			= oStrandPointer._ID,
			sParameterName			= oStrandPointer._NAME,
			oParameterRange			= oStrandPointer.RANGE,
			nParameterRangeCount	= oParameterRange.length,

			nParamPercentScore		= p_oParameterizedScore.getParameterScoreByID(sParameterID, true),
			j;

		//Logger.logDebug('FeedbackParameterBased.getParameterFeedback() | \n\tParameterID = '+sParameterID+'\n\tParameterName = '+sParameterName+'\n\tPercentScore = '+nParamPercentScore);
		// ** Iterate the RANGE Nodes in the STRAND
		if (nParameterRangeCount) {
			// ** The STRAND node has multiple RANGE child nodes
			for(j=0; j<nParameterRangeCount; j++){
				var oParameterRangePointer	= oParameterRange[j];

				if(this.isParameterPercentScoreInRange(sParameterID, nParamPercentScore, oParameterRangePointer)){
					var oParameterFeedback	= this.getParameterFeedbackByID(sParameterID);
					oParameterFeedback.setPropertiesFromMatchedRange(oParameterRangePointer, nParamPercentScore);
					break;
					//return this.createParameterFeedback(sParameterID, sParameterName, nParamPercentScore, oParameterRangePointer);
				};
			}
		}else{
			// ** The STRAND node has only 1 RANGE child node
			if(this.isParameterPercentScoreInRange(sParameterID, nParamPercentScore, oParameterRange)){
				var oParameterFeedback	= this.getParameterFeedbackByID(sParameterID);
				oParameterFeedback.setPropertiesFromMatchedRange(oParameterRange, nParamPercentScore);
				//return this.createParameterFeedback(sParameterID, sParameterName, nParamPercentScore, oParameterRange);
			}
		};
	};

	FeedbackParameterBased.prototype.isParameterPercentScoreInRange		= function(p_sParameterID, p_nPercentScore, p_oParameterRange){
		var oParamRangePointer	= p_oParameterRange,
			sRangeScore			= oParamRangePointer._SCORE,
			aScoreRange			= (sRangeScore !== '') ? sRangeScore.split(' ').join('').split(',') : [];
		//Logger.logDebug('FeedbackParameterBased.isParameterPercentScoreInRange() | \n\tScoreRange Length = '+aScoreRange.length+'\n\tScoreRange = '+aScoreRange);

		if(aScoreRange.length === 2){
			var nMinScoreRange	= Number(aScoreRange[0]),
				nMaxScoreRange	= Number(aScoreRange[1]),
				nPercentScore	= p_nPercentScore,
				bIsInRange		= (nPercentScore >= nMinScoreRange && nPercentScore <= nMaxScoreRange) ? true : false;
			//Logger.logDebug('\tChecking Score | Min = '+nMinScoreRange+' : Max = '+nMaxScoreRange+' : User Score = '+nPercentScore+' : In Range = '+bIsInRange);
			return bIsInRange;
		}else{
			Logger.logWarn('ConversationModel._getFBTypeParameterBased() | WARN: Invalid Score Range specified for Feedback Strand ID "'+p_sParameterID+'", Range ID "'+oParamRangePointer._ID+'"');
		}

		return false;
	};

	FeedbackParameterBased.prototype.getScore							= function(){
			return (this.sType.toUpperCase() == 'GLOBALPARAMETERBASEDFEEDBACK')? GlobalParameterizedScore.getScoreModel(this.sQuestionID) : ScoreManager.getScore( this.sQuestionID);
	}
	
	FeedbackParameterBased.prototype.toString							= function(){
		return "framework/core/feedback/FeedbackParameterized";
	};

	/*FeedbackParameterBased.prototype.createParameterFeedback			= function(p_sParameterID, p_sParameterName, p_nParamPercentScore, p_oParamRangePointer){
		var oParamRangePointer	= p_oParamRangePointer,
			sRangeID			= oParamRangePointer._ID,
			sRangeName			= oParamRangePointer._NAME,
			sRangeGrade			= oParamRangePointer._GRADE,
			sFeedbackText		= oParamRangePointer.__cdata;

		return new ParameterFeedback(p_sParameterID, p_sParameterName, p_nParamPercentScore, sRangeID, sRangeName, sRangeGrade, sFeedbackText);
	};*/

	return FeedbackParameterBased;
});
