define([
	'x2js',
	'framework/core/score/ScoreManager',
	'framework/utils/globals',
	'framework/utils/Logger'
], function(X2JS, ScoreManager, Globals, Logger){
	var __instanceSIMScoreManager;

	function SIMScoreManager() {
		Logger.logDebug('SIMScoreManager.CONSTRUCTOR() | '+this);
		this.oScoringRules;
		this.oIncidentController;
	}

	SIMScoreManager.prototype.setScoringRulesConfig				= function(p_xmlScoring){
		var oX2JS 			= new X2JS();
		this.oScoringRules	= oX2JS.xml2json(p_xmlScoring);
	};

	SIMScoreManager.prototype.setController						= function(p_oIncidentController){
		this.oIncidentController = p_oIncidentController;
	};

	SIMScoreManager.prototype.addScore							= function(p_oScore){
		//Logger.logDebug('SIMScoreManager.addScore() | ');
		ScoreManager.addScore(p_oScore);
	};

	SIMScoreManager.prototype.getScore							= function(p_qstnID){
		Logger.logDebug('SIMScoreManager.getScore() : Qstn ID = '+p_qstnID);
		return ScoreManager.getScore(p_qstnID);
	};

	/*
	SIMScoreManager.prototype.getTotalAchievedScore 			= function(){
			var nAchievedTotalScore		= ScoreManager.getTotalAchievedScore(),
				oRuleValues				= this.appyScoringRules(),

				nAchievedTotalScore		= nAchievedTotalScore + oRuleValues.point,
				nPoints					= nAchievedTotalScore * Math.abs(oRuleValues.percent) / 100,
				nAchievedTotalScore		= (oRuleValues.percent < 0) ? (nAchievedTotalScore - nPoints) : (nAchievedTotalScore + nPoints);
			Logger.logDebug('SIMScoreManager.getTotalAchievedScore() | Achieved Total Score = '+nAchievedTotalScore);

			return nAchievedTotalScore;
		};*/


	SIMScoreManager.prototype.getTotalMaxPossibleScore			= function(){
		//Logger.logDebug('SIMScoreManager.getTotalMaxPossibleScore() | ');
		return ScoreManager.getTotalMaxPossibleScore();
	};

	SIMScoreManager.prototype.getPercentScore 					= function(){
		var nAchievedTotalScore		= ScoreManager.getTotalAchievedScore(),
			nPercentScore			= nAchievedTotalScore * 100 / this.getTotalMaxPossibleScore();
			nPercentScore			= (nPercentScore < 0) ? 0 : nPercentScore;
		Logger.logDebug('SIMScoreManager.getPercentScore() | Percent Score = '+nPercentScore);

		return nPercentScore;

		/*
		var nPercentScore			= ScoreManager.getTotalPercentScore(),
			nScoreLength			= ScoreManager.getScoreLength(),
			nPercentScore			= nPercentScore / nScoreLength,
			oRuleValues				= this.appyScoringRules();
		Logger.logDebug('SIMScoreManager.getPercentScore() | Percent Score = '+nPercentScore);
		//var	nPercentScore			= (oRuleValues.percent < 0) ? (nPercentScore + oRuleValues.percent) : (nPercentScore + oRuleValues.percent);
		var	nPercentScore			= nPercentScore + oRuleValues.percent;
		nPercentScore				= (nPercentScore < 0) ? 0 : nPercentScore;
		Logger.logDebug('\t oRuleValues.percent = '+oRuleValues.percent);

		return nPercentScore;*/
	};

	SIMScoreManager.prototype.getWeightedScore					= function(){
		//Logger.logDebug('SIMScoreManager.getWeightedScore() | '+percentScore);
		// TODO: Implementation of weighted score
		return ScoreManager.getWeightedScore();
	};

	SIMScoreManager.prototype.getPercentageBasedFeedback		= function(){
		var aScores				= this.oScoringRules.feedbackText.score,
			nScoreLength		= aScores.length,
			nPercentScore		= this.getPercentScore(),
			i;
		if(nScoreLength){
			for (i=0; i < aScoreslength; i++) {
				var oScorePointer	= aScores[i],
					bIsInRange		= this.isScoreInRange(nPercentScore, oScorePointer);

				if(bIsInRange){return oScorePointer;}
			};
		}else{
			bIsInRange		= this.isScoreInRange(nPercentScore, aScores);
			if(bIsInRange){return oScorePointer;}
		}

		Logger.logWarn('SIMScoreManager.getPercentageBasedFeedback() | WARN: No Feedback found for the "'+nPercentScore+'"% achieved.');
	};

	SIMScoreManager.prototype.isScoreInRange					= function(p_nPercentScore, p_oScoreNode){
		var aScoreRange		= Globals.trim(p_oScoreNode._range).split('-'),
			nMinScore		= aScoreRange[0],
			nMaxScore		= aScoreRange[1];

		if(nPercentScore >= nMinScore && nPercentScore <= nMaxScore){
			return true;
		}
		return false;
	};

	SIMScoreManager.prototype.getBookmark						= function(){
		//Logger.logDebug('SIMScoreManager.getBookmark() | '+JSON.stringify(this.oScores));
		return ScoreManager.getBookmark();
	};
	SIMScoreManager.prototype.setBookmark						= function(p_jsonBookmark){
		//Logger.logDebug('SIMScoreManager.setBookmark() | '+p_jsonBookmark);
		ScoreManager.setBookmark(p_jsonBookmark);
	};




	SIMScoreManager.prototype.appyScoringRules					= function(){
		Logger.logDebug('SIMScoreManager.appyScoringRules() | ');
		var aRules				= this.oScoringRules.rules.rule,
			nRules				= aRules.length,
			oRuleValues			= {percent:0, point:0},
			i,
			nPercentScore;

		if(nRules){
			for (var i=0; i < nRules; i++) {
				var oRule		= aRules[i],
					sRuleType	= oRule._type.toUpperCase(),
					oRuleValues	= this.getRuleValues(sRuleType, oRule, oRuleValues);
			};
		}else{
			oRuleValues	= this.getRuleValues(aRules._type.toUpperCase(), aRules, oRuleValues);
		}

		return oRuleValues;
	};

	SIMScoreManager.prototype.getRuleValues						= function(p_sRuleType, p_oRule, p_oRuleValues){
		var aItem				= p_oRule.item,
			aItem				= (aItem.length === undefined) ? [aItem] : aItem,
			nItemLength			= aItem.length,
			oValues				= {nPercentDeductions:0, nPercentAdditions:0, nPointDeductions:0, nPointAdditions:0},
			i;
		Logger.logDebug('SIMScoreManager.getRuleValues() | p_sRuleType = '+p_sRuleType);

		if(nItemLength){
			for (i=0; i < nItemLength; i++) {
				if(p_sRuleType === 'PRIORITY'){
					oValues	= this.processPriorityLevelRules(aItem[i], oValues);
				}
				if(p_sRuleType === 'TIME-EVENT'){
					oValues	= this.processEventTimeLimitRules(aItem[i], oValues);
				}
				if(p_sRuleType === 'TIME-DAY'){
					oValues	= this.processDayTimeLimitRules(aItem[i], oValues);
				}
			}
		}else{
			oValues	= this.processEventTimeLimitRules(aItem, oValues);
		}
		//Logger.logDebug('\tCur % Val = '+p_oRuleValues.percent+' : % Additions = '+oValues.nPercentAdditions+' : % Deductions = '+oValues.nPercentDeductions);
		var percentVal	= p_oRuleValues.percent + (oValues.nPercentAdditions + oValues.nPercentDeductions),
			pointsVal	= p_oRuleValues.point + (oValues.nPointAdditions + oValues.nPointDeductions);
		Logger.logDebug('\t% Val = '+(percentVal));

		return {percent:percentVal, point:pointsVal};
	};

	SIMScoreManager.prototype.processPriorityLevelRules			= function(p_oItem, p_oValues){
		var oItem			= p_oItem,
			sRuleType		= oItem._type.toUpperCase(),
			nPriorityLevel	= Number(oItem._level),
			nValue			= Number(oItem._value),
			sValueType		= oItem._valueType,
			oValue;

		if(sRuleType === 'DEDUCTION'){
			// ** Check if some event having Priority Level "X" has not been completed
			if(!this.oIncidentController.anyEventWithPriorityPassed(nPriorityLevel)){
				oValue	= this.valueDeductions(sValueType, nValue, p_oValues);
			}
		}

		if(sRuleType === 'ADDITION'){
			// ** Check if some event having Priority Level "X" has been completed
			if(this.oIncidentController.anyEventWithPriorityPassed(nPriorityLevel)){
				oValue	= this.valueAdditions(sValueType, nValue, p_oValues);
			}
		}

		return oValue;
	};

	SIMScoreManager.prototype.processEventTimeLimitRules		= function(p_oItem, p_oValues){
		var oItem			= p_oItem,
			sRuleType		= oItem._type.toUpperCase(),
			sEventID		= oItem._eventid,
			nValue			= Number(oItem._value),
			sValueType		= oItem._valueType,
			oValue;

		if(sRuleType === 'DEDUCTION'){
			// ** Check if some event having Priority Level "X" has not been completed
			if(!this.oIncidentController.eventWithTimePassed(sEventID)){
				oValue	= this.valueDeductions(sValueType, nValue, p_oValues);
			}
		}

		if(sRuleType === 'ADDITION'){
			// ** Check if some event having Priority Level "X" has been completed
			if(this.oIncidentController.eventWithTimePassed(sEventID)){
				oValue	= this.valueAdditions(sValueType, nValue, p_oValues);
			}
		}

		return oValue;
	};

	SIMScoreManager.prototype.processDayTimeLimitRules			= function(p_oItem, p_oValues){
		Logger.logDebug('SIMScoreManager.processDayTimeLimitRules() | \n\tp_oItem = '+JSON.stringify(p_oItem)+'\n\tp_oValues = '+p_oValues);
		var oItem			= p_oItem,
			sRuleType		= oItem._type.toUpperCase(),
			nExtraMin		= Number(oItem._extraMin),
			nValue			= Number(oItem._value),
			sValueType		= oItem._valueType,
			oValue;

		if(sRuleType === 'DEDUCTION'){
			// ** Check if some event having Priority Level "X" has not been completed
			var nExtraMinsSpent	= this.oIncidentController.getExtraTimeSpent();
			nValue = nExtraMinsSpent * nValue / nExtraMin;
			//Logger.logDebug('\tnExtraMinsSpent = '+nExtraMinsSpent+' : % nValue Deduction = '+nValue);
			oValue	= this.valueDeductions(sValueType, nValue, p_oValues);
		}

		if(sRuleType === 'ADDITION'){
			// ** Check if some event having Priority Level "X" has been completed
			var nMinsSaved	= this.oIncidentController.getTimeSaved();
			nValue = nMinsSaved * nValue / nExtraMin;
			oValue	= this.valueAdditions(sValueType, nValue, p_oValues);
		}

		return oValue;
	};

	SIMScoreManager.prototype.valueDeductions					= function(p_sValueType, p_nValue, p_oValues){
		if(p_sValueType === '%'){
			p_oValues.nPercentDeductions -= p_nValue;
		}else{
			p_oValues.nPointDeductions -= p_nValue;
		}
		return p_oValues;
	};
	SIMScoreManager.prototype.valueAdditions					= function(p_sValueType, p_nValue, p_oValues){
		if(p_sValueType === '%'){
			p_oValues.nPercentAdditions += p_nValue;
		}else{
			p_oValues.nPointAdditions += p_nValue;
		}
		return p_oValues;
	};



	SIMScoreManager.prototype.toString							= function(){
		return 'framework/simulation/core/SIMScoreManager';
	};

	if(!__instanceSIMScoreManager){
		__instanceSIMScoreManager = new SIMScoreManager();
		Logger.logDebug('^^^^^^^^^^^^ SIMScoreManager INSTANCE ^^^^^^^^^^^^^^ '+__instanceSIMScoreManager);
	}

	return __instanceSIMScoreManager;
});