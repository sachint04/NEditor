define([
	'jquery',
	'framework/utils/globals',
	'framework/utils/EventDispatcher',
	'framework/utils/Logger'
], function($,Globals, EventDispatcher, Logger){

	function Parameter(p_oParameter){
		this.nParameterID			= p_oParameter._ID;
		this.aAssociatedParameters	= p_oParameter._AssociatedParameters;
		this.nMaxPossibleScore		= Number(p_oParameter._MaxScore) || 0;

		this.sName					= p_oParameter.NAME;
		this.sDescription			= p_oParameter.DESCRIPTION;
		this.nWeight				= isNaN(Number(p_oParameter.WEIGHT)) ? 0 : Number(p_oParameter.WEIGHT);

		this.nScore					= 0;
		this.bUpdateMaxScore		= false;

		//Logger.logDebug('############ Parameter.CONSTRUCTOR() : '+this.nWeight+'\n'+JSON.stringify(p_oParameter));
		if(this.nMaxPossibleScore === 0){
			// ** Need to update the Max Score when the score gets updated for a parameter
			this.bUpdateMaxScore	= true;
		}
	}

	Parameter.prototype							= Object.create(EventDispatcher.prototype);
	Parameter.prototype.constructor				= Parameter;

	Parameter.prototype.getID					= function(){return this.nParameterID;};
	Parameter.prototype.getWeight				= function(){return this.nWeight;};
	Parameter.prototype.getName					= function(){return this.sName;};
	Parameter.prototype.getDescription			= function(){return this.sDescription;};

	Parameter.prototype.updateMaxScore				= function(p_nValue){
		this.nMaxPossibleScore  = this.nMaxPossibleScore + p_nValue; 
	};
	Parameter.prototype.updateScore				= function(p_nValue){
		//Logger.logDebug("Parameter.updateScore() "+ this.getName()+" called with = "+p_nValue+' : Currect Score = '+this.nScore);
		if(p_nValue < 0){return;}
		this.nScore += p_nValue;
		if(this.bUpdateMaxScore){
			// ** As discussed with Shreerang, if the Max Possible Score is not defined for the parameters then
			// - The parameters score value attribute can range from -1 to 3
			// - -1 should not increment the max score
			// - 0 to 3 should increment the max score by 3
			this.nMaxPossibleScore += 3;
		}
	};
	Parameter.prototype.getScore				= function(){
		//Logger.logDebug('Parameter.getScore() : '+this.nAchievedScore);
		return this.nScore;
	};
	Parameter.prototype.getMaxPossibleScore		= function(){
		//Logger.logDebug('Parameter.getMaxPossibleScore() : '+this.nMaxPossibleScore);
		return this.nMaxPossibleScore;
	};

	Parameter.prototype.getWeightedScore		= function(){
		// ** (Parameter 1 Score / Parameter 1 Max Score) x Weight 1
		var nWeightedScore	= (this.nScore / this.nMaxPossibleScore) * this.nWeight,
			nWeightedScore	= (isNaN(nWeightedScore)) ? 0 : nWeightedScore;
		return nWeightedScore;
	};
	Parameter.prototype.getPercentScore			= function(){
		// ** Parameter Score / Parameter Max Score x 100
		var nPercentScore	= (this.nScore / this.nMaxPossibleScore * 100),
			nPercentScore	= (isNaN(nPercentScore)) ? 0 : nPercentScore;
		//Logger.logDebug('Parameter.getPercentScore() | \n\tScore = '+this.nScore+'\n\tMax Possible Score = '+this.nMaxPossibleScore+'\n\t% Score = '+nPercentScore);
		return nPercentScore;
	};

	Parameter.prototype.destroy					= function(){
		this.nParameterID			= null;
		this.aAssociatedParameters	= null;
		this.nMaxPossibleScore		= null;

		this.sName					= null;
		this.sDescription			= null;
		this.nWeight				= null;

		this.nScore					= null;
	};
	Parameter.prototype.toString				= function(){
		return 'framework/core/score/Parameter';
	};

	Parameter.prototype.reset					= function(){
		//Logger.logDebug("Parameter.reset() "+ this.getName());
		this.nScore = 0;
		if(this.bUpdateMaxScore){
			this.nMaxPossibleScore = 0;
		}
		this.aUserScore			= [];
		this.aUserSelections	= [];
		return true;
	};

	return Parameter;
});
