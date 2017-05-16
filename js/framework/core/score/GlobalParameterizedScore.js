/**
 * Author: Sachin Tumbre
 * Date: 28th Nov 2014
 * GlobalParameterizedScore: Acts as a manager for all parameter based score objects to return cumulative
 * score for a parameter  
 */
define([
	'framework/utils/globals',
	'framework/core/score/Score',
	'framework/core/score/Parameter',
	'framework/core/score/ParameterizedScore',
	'framework/utils/Logger'
], function(Globals,Score,Parameter, ParameterizedScore, Logger){
	var __instanceGlobalParameterizedScore;
	function GlobalParameterizedScore(){
		//Logger.logDebug('GlobalParameterizedScore.CONSTRUCTOR() ');
		this.aScores = {};
		this.oParameterList		= {};
		this.nParameterCount;
		return this;
	}

	GlobalParameterizedScore.prototype.createScore			= function(p_sScoringUID){
		var oScore = new ParameterizedScore(p_sScoringUID);
		Logger.logDebug('GlobalParameterizedScore.prototype.createScore'+ p_sScoringUID +' | '+this.oDataModel+' | '+ oScore);
		this.aScores[p_sScoringUID] 	= oScore;
		return oScore;
	}
	
	GlobalParameterizedScore.prototype.initializeParameterList			= function(p_sScoringUID, p_aParameters){
		Logger.logDebug('GlobalParameterizedScore : initializeParameterList	- Parameters = '+ JSON.stringify(p_aParameters));
		this.nParameterCount	= p_aParameters.length;
		if(this.nParameterCount){
			for(i=0; i<this.nParameterCount; i++){
				var oParameterPointer	= p_aParameters[i],
					sParameterID		= oParameterPointer._ID;
				Logger.logDebug('GlobalParameters. initializeParameterList() Array has '+sParameterID +' = '+ this.hasParameter(sParameterID))
				if(!this.hasParameter(sParameterID)){
					this.oParameterList[sParameterID] = new Parameter(oParameterPointer);
				}else{
					if(!isNaN(Number(oParameterPointer._MaxScore))){
						this.getParameterObjByID(sParameterID).updateMaxScore(Number(oParameterPointer._MaxScore))
					}
				}
			}
		}else{
			var oParameterPointer	= p_aParameters,
				sParameterID		= oParameterPointer._ID;
				Logger.logDebug('GlobalParameters. initializeParameterList() Parameter object has '+sParameterID +' = '+ this.hasParameter(sParameterID))
			if(!this.hasParameter(sParameterID) && !isNaN(Number(oParameterPointer._MaxScore))){
				this.oParameterList[sParameterID] = new Parameter(oParameterPointer);
			}else{
				if(!isNaN(Number(oParameterPointer._MaxScore))){
					this.getParameterObjByID(sParameterID).updateMaxScore(Number(oParameterPointer._MaxScore))
				}
			}
			this.nParameterCount = 1;
		}
		
		this.aScores[p_sScoringUID].initializeParameterList(p_aParameters);
	};

	GlobalParameterizedScore.prototype.hasParameter			 			= function(p_sID){
		// Logger.logDebug('GlobalParameterizedScore.hasParameter()  | p_sID : '+ p_sID);
		var result = false;
		for(var str in this.oParameterList){
			var oParameterPointer	= this.oParameterList[str],
			sParameterID			= oParameterPointer.nParameterID;
			
				//Logger.logDebug('GlobalParameterizedScore.hasParameter()  oParameterPointer'+ JSON.stringify(oParameterPointer));
				Logger.logDebug('GlobalParameterizedScore.hasParameter()  '+ sParameterID+' | '+ p_sID);
			if(sParameterID === p_sID){
				result = true;
				break;
			}			
		}
		return result;
	}
	
	GlobalParameterizedScore.prototype.updateMaxScore			 			= function(p_nValue){
		 var oParameter  = this.getParameterObjByID(p_sParameterID, 'getParameterScoreByID');
		 oParameter.updateMaxScore(p_nValue);
	}
	// ** ADDS up the value to the current value
	GlobalParameterizedScore.prototype.updateScore			 			= function( p_aParameters){
		Logger.logDebug('GlobalParameterizedScore : updateScore - '+ JSON.stringify(p_aParameters));
		for(i=0; i<p_aParameters.length; i++){		
			var oParameterPointer	= p_aParameters[i],
				sParameterID		= oParameterPointer._ID || oParameterPointer._id,
				nParameterValue		= Number(oParameterPointer._VALUE) || Number(oParameterPointer._value),
				oParameter			= this.getParameterObjByID(sParameterID, 'updateScore');
				oParameter.updateScore(nParameterValue);
		}
		//this.aScores[p_sScoringUID].updateScore(p_aParameters);
	};

	//** Overidden on purpose, to avoid confusion as a parameter based score won't be storing the array parameters array supplied
	GlobalParameterizedScore.prototype.updateUserScores		    = function(p_aParameters){
		//Logger.logDebug('GlobalParameterizedScore.updateUserScores() : '+p_nUserScore);
		//this.aUserScore.push(p_nUserScore);
	};

	GlobalParameterizedScore.prototype.getWeightedAverageScore			= function(){
		Logger.logDebug('GlobalParameterizedScore.getWeightedAverageScore() | getWeightedAverageScore = '+JSON.stringify( this.oParameterList));
		var nWeightedScoreTotal	= 0,
			nWeightTotal		= 0,
			sParamID;
		
		for(sParamID in this.oParameterList){
			var oParameter			= this.oParameterList[sParamID];
			if(oParameter.getScore() != -1){
				nWeightedScoreTotal		+= oParameter.getWeightedScore();
				nWeightTotal			+= oParameter.getWeight();
				Logger.logDebug('GlobalParameterizedScore.getWeightedAverageScore() | Weighted Score Total = '+(nWeightedScoreTotal)+' : Weight Total = '+(nWeightTotal));
			}
		}
		//Logger.logDebug('GlobalParameterizedScore.getWeightedAverageScore() | Qstn ID = '+this.sQstnID+' : Weighted Score Total = '+(nWeightedScoreTotal)+' : Weight Total = '+(nWeightTotal)+' :: '+(nWeightedScoreTotal / nWeightTotal));
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
	GlobalParameterizedScore.prototype.getPercentScore					= function(){
		Logger.logDebug('GlobalParameterizedScore.getPercentScore() | Qstn ID = '+this.sQstnID+' : % = '+this.getWeightedAverageScore() );
		var val	= (this.getWeightedAverageScore() * 100),
			val	= (isNaN(val)) ? 0 : val;
		return val;
	};
	
	GlobalParameterizedScore.prototype.getScoreModel				 			= function(p_sScoringUID){
		return this.aScores[p_sScoringUID];
	}
	// ** Overriding the Super Class menthod
	GlobalParameterizedScore.prototype.getScore				 			= function(){
		var nAchievedScore = 0;
		for(var id in this.oParameterList){
			nAchievedScore += this.oParameterList[id].getScore();
		}

		return nAchievedScore;
	};
	// ** Overriding the Super Class menthod
	GlobalParameterizedScore.prototype.getMaxPossibleScore				= function(){
		var nMaxPossibleScore = 0;
		for(var id in this.oParameterList){
			nMaxPossibleScore += this.oParameterList[id].getMaxPossibleScore();
		}

		return nMaxPossibleScore;
	};
	// ** Overriding the Super Class menthod
	GlobalParameterizedScore.prototype.getUserScores			 			= function(){
		var aParameterScoreList = [];
		for(var id in this.oParameterList){
			aParameterScoreList.push(this.oParameterList[id].getScore());
		}

		return aParameterScoreList;
	};

	
	
	 GlobalParameterizedScore.prototype.getParameterScoreByID				= function(p_sParameterID, bInPercent){
		var oParameter	= this.getParameterObjByID(p_sParameterID, 'getParameterScoreByID'),
			val			= (bInPercent) ? oParameter.getPercentScore() : oParameter.getScore();
		//Logger.logDebug('GlobalParameterizedScore.getParameterScoreByID() | \n\tParameter ID = '+p_sParameterID+'\n\tParameter Obj = '+oParameter+'\n\t% Score = '+val);
		return val;
	};
	GlobalParameterizedScore.prototype.getParameterScoreByName			= function(p_sParameterName, bInPercent){
		var oParameter	= this.getParameterObjByName(p_sParameterName, 'getParameterScoreByName'),
			val			= (bInPercent) ? oParameter.getPercentScore() : oParameter.getScore();
		return val;
	};

	GlobalParameterizedScore.prototype.getParameterList					= function(){
		return this.oParameterList;
	};
	GlobalParameterizedScore.prototype.setParameterList					= function(p_oParameterList){
		 this.oParameterList=p_oParameterList;

	};

	GlobalParameterizedScore.prototype.getParameterObjByID				= function(p_sParameterID, p_sFunctionScope){
		var oParameter = this.oParameterList[p_sParameterID];
		if(!oParameter){
			Logger.logError('GlobalParameterizedScore.'+p_sFunctionScope+'() | ERROR: Parameter with ID "'+p_sParameterID+'" not found.');
			return;
		}
		return oParameter;
	};
	GlobalParameterizedScore.prototype.getParameterObjByName				= function(p_sParameterName, p_sFunctionScope){
		var sParamID,
			oParameter;

		for(sParamID in this.oParameterList){
			oParameter	= this.oParameterList[sParamID];
			if (oParameter.getName() === p_sParameterName) {return oParameter;};
		}
		Logger.logError('GlobalParameterizedScore.'+p_sFunctionScope+'() | ERROR: Parameter with Name "'+p_sParameterName+'" not found.');
	};
	
	/**
	 * User selection, setID,optionID,nextSetID | user score
	 * 0,03,03|0,1,2,0,0,0,0,0,0,0
	 */
	GlobalParameterizedScore.prototype.getBookmark	   			 	= function(){
		var result = this.getID()+'|';
		for(var i=0;i < this.aUserSelections.length;i++){
			var oSelection = this.aUserSelections[i];
			result = result +oSelection.setID+','+ oSelection.optionID+','+oSelection.nextSetID;
			if(i< this.aUserSelections.length-1){
				result  = result +'-';
			}
		}
		result = result +'|'+this.getUserScores().toString();	
		return result;
	}
	
	GlobalParameterizedScore.prototype.reset								= function(){
		for(var i=0; i<this.nParameterCount; i++){
			var oParameterPointer	= p_aParameters[i],
				sParameterID		= oParameterPointer._ID;

			this.oParameterList[sParameterID].reset();
		}
		return true;
	};

		if(!__instanceGlobalParameterizedScore){
		__instanceGlobalParameterizedScore = new GlobalParameterizedScore();
		Logger.logDebug('^^^^^^^^^^^^ ScoreManager INSTANCE ^^^^^^^^^^^^^^ '+__instanceGlobalParameterizedScore);
	}

	return __instanceGlobalParameterizedScore;
});