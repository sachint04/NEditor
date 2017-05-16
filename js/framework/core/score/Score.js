define([
	'framework/utils/Logger'
], function(Logger){

	function Score(p_qstnID){
		//Logger.logDebug('Score.CONSTRUCTOR() ');
		//ScoreAbstract.call(this);
		if(!p_qstnID){Logger.logError('Score.CONSTRUCTOR() | ERROR: Unique Question ID needs to be passed to create a Score Object.');}
		this.sQstnID			= p_qstnID,
		this.nMaxPossibleScore	= 0,
		this.nAchievedScore		= 0,
		this.nScoreWeightage	= 0;
		this.aUserScore			= [];
		this.aUserSelections	= [];
        this.bScorable 			= false; /* Sachin Tumbre(12/10/2014)-  Activity node level attribute.  To skip activity from calculating score activity*/
	}

	//Score.prototype								= Object.create(ScoreAbstract.prototype);
	Score.prototype.constructor					= Score;

	Score.prototype.getID						= function(){
		//Logger.logDebug('Score.getID() : '+this.sQstnID);
		return this.sQstnID;
	};

	// ** ADDS up the value to the current value
	Score.prototype.updateScore					= function(p_nScore){
		//Logger.logDebug('Score.updateScore() : '+p_nScore);
		this.isNumber(p_nScore, 'Score.updateScore', 'Score');
		this.nAchievedScore += p_nScore;
		//Logger.logDebug('Score.updateScore() : '+this.nAchievedScore);
	};
	Score.prototype.updateUserScores		    = function(p_nUserScore){
		//Logger.logDebug('Score.updateUserScores() : '+p_nUserScore);
		this.aUserScore.push(p_nUserScore);
		//Logger.logDebug('Score.updateUserScores() : '+this.aUserScore);
	};
	Score.prototype.updateUserSelections	    = function(p_sUserSelection){
		//Logger.logDebug('Score.updateUserSelections() : BEFORE : aUserSelections Length = '+this.aUserSelections.length);
		this.aUserSelections.push(p_sUserSelection);
		//Logger.logDebug('Score.updateUserSelections() : AFTER : aUserSelections Length = '+this.aUserSelections.length);
	};

	Score.prototype.getBookmark	   			 	= function(){
		//var result = this.getID().slice("~")+'|';
		var result = this.getID();
		//Logger.logDebug('Score.user getBookmark  : '+this.aUserSelections.length+ " result "+result);
		//Logger.logDebug('Score.user result  : '+this.getID().lastIndexOf("~")+'|');
		openBracket = "[";
		closeBracket = "]";
		sSelection   = "";
		for(var i=0;i < this.aUserSelections.length;i++){
			var oSelection = this.aUserSelections[i];
			/* TO BE DONE */
			//Logger.logDebug('Score.user selection  : '+oSelection.toString();
			if(openBracket != "" ){
				sSelection = sSelection+ openBracket;
				sSelection= sSelection+JSON.stringify(oSelection);
				openBracket = "";
			}else{
					sSelection= sSelection +','+JSON.stringify(oSelection);
			}

		}

		if(sSelection != ""){
			sSelection  = sSelection+ closeBracket;
		}

		result = result +'|' +sSelection;
		//Logger.logDebug('Score.user selection  result : '+result);
		result = result +'|'+this.getUserScores().toString();
		return result;
	};

	Score.prototype.updateMaxPossibleScore		= function(p_nMaxPossibleScore){
		//Logger.logDebug('Score.setMaxPossibleScore() : '+p_nMaxPossibleScore);
		this.isNumber(p_nMaxPossibleScore, 'Score.updateMaxPossibleScore', 'Max possible Score');
		this.nMaxPossibleScore += p_nMaxPossibleScore;
	};

	Score.prototype.getPercentScore				= function(){
		Logger.logDebug('Score.getPercentScore() | \n\tQstn ID = '+this.sQstnID+'\n\tAchieved Score = '+this.nAchievedScore+'\n\tMax Score = '+this.nMaxPossibleScore+'\n\t% Score = '+(this.nAchievedScore * 100 / this.nMaxPossibleScore));
		return (this.nAchievedScore * 100 / this.nMaxPossibleScore);
	};
	// ** SETS the value to the current value
	Score.prototype.setScore					= function(p_nScore){
		//Logger.logDebug('Score.setScore() : '+p_nScore);
		this.isNumber(p_nScore, 'Score.setScore', 'Score');
		this.nAchievedScore = p_nScore;
	};
	Score.prototype.getScore					= function(){
		//Logger.logDebug('Score.getScore() : '+this.nAchievedScore);
		return this.nAchievedScore;
	};

	Score.prototype.setMaxPossibleScore			= function(p_nMaxPossibleScore){
		//Logger.logDebug('Score.setMaxPossibleScore() : '+p_nMaxPossibleScore);
		this.isNumber(p_nMaxPossibleScore, 'Score.setMaxPossibleScore', 'Max Possible Score');
		this.nMaxPossibleScore = p_nMaxPossibleScore;
	};
	Score.prototype.getMaxPossibleScore			= function(){
		//Logger.logDebug('Score.getMaxPossibleScore() : '+this.nMaxPossibleScore);
		return this.nMaxPossibleScore;
	};

	Score.prototype.setUserScores				= function(p_aUserScore){
		//Logger.logDebug('Score.setUserScores() : '+p_aUserScore);
		this.isArray(p_aUserScore, 'Score.setUserScores', 'User Scores');
		this.aUserScore = p_aUserScore;
	};
	Score.prototype.getUserScores				= function(p_nIndex){
		//Logger.logDebug('Score.getUserScores() : '+this.aUserScore);
		var val	= (p_nIndex) ? this.aUserScore[p_nIndex] : this.aUserScore;
		return val;
	};

	Score.prototype.setUserSelections			= function(p_aUserSelections){
		//Logger.logDebug('Score.setUserSelections() : '+p_aUserSelections);
		this.isArray(p_aUserSelections, 'Score.setUserSelections', 'User Selections');
		this.aUserSelections = p_aUserSelections;
	};
    /**
    * Sachin Tumbre(12/10/2014) - Added to skip activity from score calculation.
    */
    Score.prototype.setScorable 		= function(p_bFlag) {
        Logger.logDebug('Score.setScorable() : '+p_bFlag);
    	this.bScorable = p_bFlag;
    };
    Score.prototype.isScorable 			= function() {
    	return (this.bScorable != undefined && this.bScorable === true) ;
    };
	Score.prototype.getUserSelections			= function(p_nIndex){
		//Logger.logDebug('Score.getUserSelections() : '+this.aUserSelections);
		var val	= (p_nIndex) ? this.aUserSelections[p_nIndex] : this.aUserSelections;
		return val;
	};


	Score.prototype.reset						= function(){
		//Logger.logDebug('Score.reset() : BEFORE : aUserSelections Length = '+this.aUserSelections.length);
		this.nAchievedScore = 0;
        //this.nMaxPossibleScore = 0; //Set to Zero for onRevisit
		this.aUserScore			= [];
		this.aUserSelections	= [];
		//Logger.logDebug('Score.reset() : AFTER : aUserSelections Length = '+this.aUserSelections.length);
		return true;
	};

	Score.prototype.destroy						= function(){
		//Logger.logDebug('Score.destroy() | Qstn ID = '+this.sQstnID);
		this.sQstnID				= null;
		this.aUserScore				= null;
		this.aUserSelections		= null;
		this.nAchievedScore			= null;
		this.nMaxPossibleScore		= null;
		this.nScoreWeightage		= null;
	};



	Score.prototype.isNumber					= function(p_param, p_sFunctionScope, p_sParamName){
		if(isNaN(p_param)){Logger.logError('Score.'+p_sFunctionScope+'() | ERROR: Invalid Parameter. Received "'+p_param+'". The "'+p_sParamName+'" supplied needs to be a number.');};
		return true;
	};
	Score.prototype.isArray						= function(p_param, p_sFunctionScope, p_sParamName){
		if(!p_param instanceof Array){Logger.logError(p_sFunctionScope+'() | ERROR: Invalid Parameter. Received "'+p_param+'". The "'+p_sParamName+'" supplied needs to be an Array.');};
		return true;
	};
	Score.prototype.toString					= function(){
		return 'framework/core/score/Score';
	};

	return Score;
});