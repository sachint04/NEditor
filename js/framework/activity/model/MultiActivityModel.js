/**
 * @author BharatK
 * @modified Vincent Gomes
 */
define([
	'framework/activity/model/ActivityModelAbstract',
	'framework/core/feedback/History',
	'framework/utils/Logger'
], function(ComponentModelAbstract, History, Logger){

	/** 
	* Last edited by : Sachin Tumbre  - 
	* Model may load dependent resources i.e. isap xml. hence it requires GUID and ScoringID
	*/ 
	function MultiActivityModel(p_xmlActivityNode,  p_sGUID, p_sScoringUID){
		//Logger.logDebug('MultiActivityModel.CONSTRUCTOR() ');
		ComponentModelAbstract.call(this, p_xmlActivityNode,  p_sGUID, p_sScoringUID);
	}

	MultiActivityModel.prototype									= Object.create(ComponentModelAbstract.prototype);
	MultiActivityModel.prototype.constructor						= MultiActivityModel;

    MultiActivityModel.prototype.getHistory                         = function(){
        return {}
    };
    ComponentModelAbstract.prototype.getOptionalData                                = function(p_oOptionalData){
        return {};
    };
	MultiActivityModel.prototype.getDependencyList					= function(){
	    return this.oDataModel._deps.split(',');
	}
	MultiActivityModel.prototype.destroy							= function(){
		ComponentModelAbstract.prototype.destroy.call(this);
		this.prototype			= null;
	};	
	
	MultiActivityModel.prototype.toString 						= function(){
		return 'framework/activity/model/MultiActivityModel';
	};

	return MultiActivityModel;
});