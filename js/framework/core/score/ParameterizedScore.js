define([
	'framework/utils/globals',
	'framework/core/score/Score',
	'framework/core/score/Parameter',
	'framework/utils/Logger'
], function(Globals,Score,Parameter, Logger){

	function ParameterizedScore(p_sScoringUID){
		//Logger.logDebug('ParameterizedScore.CONSTRUCTOR() ');
		Score.call(this, p_sScoringUID);
		this.oParameterList;
		this.nParameterCount;
		return this;
	}

	ParameterizedScore.prototype 									= Object.create(Score.prototype);
	ParameterizedScore.prototype.constructor 						= ParameterizedScore;

	ParameterizedScore.prototype.initializeParameterList			= function(p_aParameters){
		p_aParameters 			= (p_aParameters.length) ? p_aParameters : [p_aParameters];
		
		this.oParameterList		= {};
		this.nParameterCount 	= p_aParameters.length;	

			for(i=0; i<this.nParameterCount; i++){
				var oParameterPointer	= p_aParameters[i],
					sParameterID		= oParameterPointer._ID;

				this.oParameterList[sParameterID] = new Parameter(oParameterPointer);
			}
	};

	// ** ADDS up the value to the current value
	ParameterizedScore.prototype.updateScore			 			= function(p_aParameters){
		p_aParameters 	= (p_aParameters.length)? p_aParameters 	: [p_aParameters];
		for(i=0; i<p_aParameters.length; i++){
			var oParameterPointer	= p_aParameters[i],
				sParameterID		= oParameterPointer._ID,
				nParameterValue		= Number(oParameterPointer._VALUE),
				oParameter			= this.getParameterObjByID(sParameterID, 'updateScore');
			if(!isNaN(nParameterValue)){
				oParameter.updateScore(nParameterValue);
			}
		}
	};

	//** Overidden on purpose, to avoid confusion as a parameter based score won't be storing the array parameters array supplied
	ParameterizedScore.prototype.updateUserScores		    = function(p_aParameters){
		//Logger.logDebug('ParameterizedScore.updateUserScores() : '+p_nUserScore);
		//this.aUserScore.push(p_nUserScore);
	};

	ParameterizedScore.prototype.getWeightedAverageScore			= function(){
		/*var oWeightedAverageScore=0;
		for(var id in this.oParameterList){
			oWeightedAverageScore += (this.oParameterList[id].nWeight*this.oParameterList[id].nScore);
		}

		return (oWeightedAverageScore / this.nParameterCount);*/

		var nWeightedScoreTotal	= 0,
			nWeightTotal		= 0,
			sParamID;

		for(sParamID in this.oParameterList){
			var oParameter			= this.oParameterList[sParamID];
			if(!oParameter.aAssociatedParameters){
			nWeightedScoreTotal		+= oParameter.getWeightedScore();
			nWeightTotal			+= oParameter.getWeight();
				Logger.logDebug('ParameterizedScore.getWeightedAverageScore() | Weighted Score Total = '+(nWeightedScoreTotal)+' : Weight Total = '+(nWeightTotal));
			}
		}
		//Logger.logDebug('ParameterizedScore.getWeightedAverageScore() | Qstn ID = '+this.sQstnID+' : Weighted Score Total = '+(nWeightedScoreTotal)+' : Weight Total = '+(nWeightTotal)+' :: '+(nWeightedScoreTotal / nWeightTotal));
		var val =  (nWeightedScoreTotal / nWeightTotal),
			val	= (isNaN(val)) ? 0 : val;
		return val;
	};

	/*
	  [(Parameter 1 Score / Parameter 1 Max Score) x Weight 1 + (Parameter n Score / Parameter n Max Score x Weight n)] x 100
	  ------------------------------------------------------------------------------------------------------------------
                                      				Weight 1 + Weight n
	 */
	// ** Overriding the Super Class menthod
	ParameterizedScore.prototype.getPercentScore					= function(){
		//Logger.logDebug('ParameterizedScore.getPercentScore() | Qstn ID = '+this.sQstnID+' : % = '+this.getWeightedAverageScore() );
		var val	= (this.getWeightedAverageScore() * 100),
			val	= (isNaN(val)) ? 0 : val;
		return val;
	};
	// ** Overriding the Super Class menthod
	ParameterizedScore.prototype.getScore				 			= function(){
		var nAchievedScore = 0;
		for(var id in this.oParameterList){
			nAchievedScore += this.oParameterList[id].getScore();
		}

		return nAchievedScore;
	};
	// ** Overriding the Super Class menthod
	ParameterizedScore.prototype.getMaxPossibleScore				= function(){
		var nMaxPossibleScore = 0;
		for(var id in this.oParameterList){
			nMaxPossibleScore += this.oParameterList[id].getMaxPossibleScore();
		}

		return nMaxPossibleScore;
	};
	// ** Overriding the Super Class menthod
	ParameterizedScore.prototype.getUserScores			 			= function(){
		var aParameterScoreList = [];
		for(var id in this.oParameterList){
			aParameterScoreList.push(this.oParameterList[id].getScore());
		}

		return aParameterScoreList;
	};


	ParameterizedScore.prototype.getParameterScoreByID				= function(p_sParameterID, bInPercent){
		var oParameter	= this.getParameterObjByID(p_sParameterID, 'getParameterScoreByID'),
			val			= (bInPercent) ? oParameter.getPercentScore() : oParameter.getScore();
		//Logger.logDebug('ParameterizedScore.getParameterScoreByID() | \n\tParameter ID = '+p_sParameterID+'\n\tParameter Obj = '+oParameter+'\n\t% Score = '+val);
		return val;
	};
	ParameterizedScore.prototype.getParameterScoreByName			= function(p_sParameterName, bInPercent){
		var oParameter	= this.getParameterObjByName(p_sParameterName, 'getParameterScoreByName'),
			val			= (bInPercent) ? oParameter.getPercentScore() : oParameter.getScore();
		return val;
	};

	ParameterizedScore.prototype.getParameterList					= function(){
		return this.oParameterList;
	};
	ParameterizedScore.prototype.setParameterList					= function(p_oParameterList){
		 this.oParameterList=p_oParameterList;

	};

	ParameterizedScore.prototype.getParameterObjByID				= function(p_sParameterID, p_sFunctionScope){
		var oParameter = this.oParameterList[p_sParameterID];
		if(!oParameter){
			Logger.logError('ParameterizedScore.'+p_sFunctionScope+'() | ERROR: Parameter with ID "'+p_sParameterID+'" not found.');
			return;
		}
		//Logger.logDebug('ParameterizedScore.'+p_sFunctionScope+'() | Parameter with ID "'+p_sParameterID+'" : Value = '+JSON.stringify(oParameter));
		return oParameter;
	};
	ParameterizedScore.prototype.getParameterObjByName				= function(p_sParameterName, p_sFunctionScope){
		var sParamID,
			oParameter;

		for(sParamID in this.oParameterList){
			oParameter	= this.oParameterList[sParamID];
			if (oParameter.getName() === p_sParameterName) {return oParameter;};
		}
		Logger.logError('ParameterizedScore.'+p_sFunctionScope+'() | ERROR: Parameter with Name "'+p_sParameterName+'" not found.');
	};

	ParameterizedScore.prototype.reset								= function(){
		//Logger.logDebug('ParameterizedScore.reset() | ');
		for(var sParamID in this.oParameterList){
			var oParameter			= this.oParameterList[sParamID];
			oParameter.reset();
		}

		Score.prototype.reset.call(this);
		return true;
	};

	 ParameterizedScore.prototype.toString = function() {
        return 'framework/core/score/ParameterizedScore';
    };
	return ParameterizedScore;
});