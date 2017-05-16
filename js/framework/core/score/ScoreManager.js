define([
	'framework/core/score/Score',
	'framework/utils/Logger'
], function(Score, Logger){
	var __instanceScoreManager;

	function ScoreManager() {
		//Logger.logDebug('ScoreManager.CONSTRUCTOR() | '+this);
		this.oScores		= {};
		this.nScoreLength	= 0;
	}

	ScoreManager.prototype.addScore							= function(p_oScore){
		var sQstnID	= p_oScore.getID();
		if(!p_oScore instanceof Score){Logger.logError('ScoreManager.addScore() | ERROR: The argument supplied needs to be an instance of the "Score" Object');}
		if(this.oScores[sQstnID]){Logger.logWarn('ScoreManager.addScore() | WARN: Duplicate Score | Question ID. Score Object with ID "'+sQstnID+'" already exists');}
		this.oScores[sQstnID]	= p_oScore;
		this.nScoreLength		+= 1;
		//Logger.logDebug('ScoreManager.addScore() | Qstn ID = '+sQstnID+' : Achieved Score = '+this.oScores[sQstnID].getScore());
	};

	ScoreManager.prototype.getScore							= function(p_qstnID){
		//Logger.logDebug('ScoreManager.getScore() : Qstn ID = '+p_qstnID);
		var o = (p_qstnID) ? this.oScores[p_qstnID] : this.oScores;
		if(!o){Logger.logWarn('ScoreManager.getScore() | WARN: Score Object with ID "'+p_qstnID+'" not found.');}
		return o;
	};

	ScoreManager.prototype.resetScore						= function(p_sScoringUID){
		//Logger.logDebug('ScoreManager.setBookmark() | '+p_jsonBookmark);
		if(p_sScoringUID){// ** Reset Socre for a specific Scoring UID
			var oScore = this.oScores[p_sScoringUID];
			oScore.reset();
			return;
		}
		// ** Reset All Scores
		for(var sScoringUID in this.oScores){
			var oScore = this.oScores[sScoringUID];
			oScore.reset();
		}
	};

	ScoreManager.prototype.getTotalAchievedScore 			= function(){
		//Logger.logDebug('ScoreManager.getTotalAchievedScore() | ');
		var nAchievedScore		= 0,
			prop;

		for(prop in this.oScores){
			/* Sachin Tumbre(12/10/2014) */
			if(this.oScores[prop].isScorable()){
				nAchievedScore += this.oScores[prop].getScore();
			}
		}
		return nAchievedScore;
	};

	ScoreManager.prototype.getTotalMaxPossibleScore			= function(){
		//Logger.logDebug('ScoreManager.getTotalMaxPossibleScore() | ');
		var nMaxPossibleScore	= 0,
			prop;

		for(prop in this.oScores){
			/* Sachin Tumbre(12/10/2014) */
			if(this.oScores[prop].isScorable()){
				nMaxPossibleScore += this.oScores[prop].getMaxPossibleScore();
			}
		}
		return nMaxPossibleScore;
	};

	ScoreManager.prototype.getTotalPercentScore 			= function(){
		//Logger.logDebug('ScoreManager.getTotalPercentScore() | ');
		var nPercentScoreTotal		= 0,
			score;

		for(score in this.oScores){
			oScorePointer		= this.oScores[score];
			/* Sachin Tumbre(12/10/2014) */
			if(oScorePointer.isScorable()){
				nPercentScoreTotal	+= oScorePointer.getPercentScore();
			}
		}
		//Logger.logDebug('ScoreManager.getPercentScore() | % Score Total = '+nPercentScoreTotal);
		return nPercentScoreTotal;
	};

	ScoreManager.prototype.getScoreLength					= function(){
		//Logger.logDebug('ScoreManager.getTotalPercentScore() | ');
		return this.nScoreLength;
	};

	/* Activity 1 Score in % + Activity 2 Score in % + ….. + Activity n Score in %
	   -------------------------------------------------------------------------------------
                                     Number of Activities
	 */
	ScoreManager.prototype.getPercentScore 					= function(){
		/*var nAchievedScore		= 0,
			nMaxPossibleScore	= 0,
			score,
			oScorePointer,
			nPercentScore;

		for(score in this.oScores){
			oScorePointer		= this.oScores[score];
			nAchievedScore		+= oScorePointer.getScore();
			nMaxPossibleScore	+= oScorePointer.getMaxPossibleScore();
		}

		nPercentScore = nAchievedScore * 100 / nMaxPossibleScore;
		//Logger.logDebug('ScoreManager.getPercentScore() | nAchievedScore = '+nAchievedScore+' : nMaxPossibleScore = '+nMaxPossibleScore+' : nPercentScore = '+nPercentScore+' : Scope = '+this);

		return nPercentScore;*/

		var nPercentScore = this.getTotalPercentScore() / this.getScoreLength();
		//Logger.logDebug('ScoreManager.getPercentScore() | % Score = '+nPercentScore);

		return nPercentScore;
	};

	ScoreManager.prototype.getWeightedScore					= function(){
		//Logger.logDebug('ScoreManager.getWeightedScore() | '+percentScore);
		// TODO: Implementation of weighted score
	};

	/*ScoreManager.prototype.getBookmark						= function(){
		//Logger.logDebug('ScoreManager.getBookmark() | '+JSON.stringify(this.oScores));
		return JSON.stringify(this.oScores);
	};*/
	ScoreManager.prototype.setBookmark						= function(p_jsonBookmark){
		//Logger.logDebug('ScoreManager.setBookmark() | '+p_jsonBookmark);
		this.oScores = JSON.parse(p_jsonBookmark);
	};
	
	ScoreManager.prototype.getBookmark			= function(){
		// //Logger.logDebug('ScoreManager.getBookmark() | oScores.length: '+this.oScores);
		var result;
		for(var str in this.oScores){
			var oScore = this.oScores[str];
			// var str =	oScore.getID()+'|'+oScore.getUserSelectionsString()+'|'+oScore.getUserScores().toString();
			if(!result){
				result = oScore.getBookmark();
			} else{
				result = result+'*'+ oScore.getBookmark();
			}
			//Logger.logDebug('ScoreManager.getBookmark() '+ oScore.getBookmark()+ ' | '+ str);
		}
		return result;
	};
	

	ScoreManager.prototype.toString							= function(){
		return 'framework/core/score/ScoreManager';
	};

	if(!__instanceScoreManager){
		__instanceScoreManager = new ScoreManager();
		//Logger.logDebug('^^^^^^^^^^^^ ScoreManager INSTANCE ^^^^^^^^^^^^^^ '+__instanceScoreManager);
	}

	return __instanceScoreManager;
});