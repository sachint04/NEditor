define([
	'framework/controller/CourseController',
	'framework/viewcontroller/PageAbstractController',
	'framework/utils/Logger'
], function(CourseController, PageAbstract, Logger){

	/**
	 * Function DecisionAbstract() : gets called after the view is populated with the required content based on ID mapping.
	 * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
	 * @param p_sGUID 		: Page GUID
	 * @param p_sIncidentID : Incident ID
	 * @param p_sEventID	: Event ID
	 */
	function DecisionAbstract(p_oCourseController, p_$decisionHolder, p_domView, p_xmlData, p_cssData, p_sGUID, p_sIncidentID, p_sEventID){
		//Logger.logDebug('DecisionAbstract.CONSTRUCTOR() | p_sGUID = '+p_sGUID+' : Incident ID = '+p_sIncidentID+' : Event ID = '+p_sEventID/*+'\n\tCSS = '+p_cssData*/);
		PageAbstract.call(this, CourseController, p_$decisionHolder, p_domView, p_xmlData, p_cssData, p_sGUID);

		this.sIncidentID	= p_sIncidentID;
		this.sEventID		= p_sEventID;

		return this;
	}

	DecisionAbstract.prototype								= Object.create(PageAbstract.prototype);
	DecisionAbstract.prototype.constructor					= DecisionAbstract;

	// ** Called from the 'initialize' method in the concrete classes
	DecisionAbstract.prototype.dispatchPageLoadedEvent		= function(){
		//Logger.logDebug('DecisionAbstract.dispatchPageLoadedEvent() | ');
		this.dispatchEvent('PAGE_LOADED', {type:'PAGE_LOADED', target:this, GUID:this.getGUID(), eventID:this.sEventID, incidentID:this.sIncidentID});
		PageAbstract.prototype.dispatchPageLoadedEvent.call(this);
	};

	DecisionAbstract.prototype.initActivity				= function(p_oComponent, p_$xmlActivity, p_bIsSimulation){
		//Logger.logDebug('DecisionAbstract.initActivity() | Is Simulation = '+p_bIsSimulation);
		PageAbstract.prototype.initActivity.call(this, p_oComponent, p_$xmlActivity, !p_bIsSimulation);
	};

	DecisionAbstract.prototype.dispatchActivityCompleteEvent	= function(e){
		var sScoringUID		= e.scoringuid,
			sDecisionID		= this.getDecisionID(this.getGUID());
		// ** Dispatch Event
		this.dispatchEvent('DECISION_COMPLETE', {type:'DECISION_COMPLETE', target:this, scoringuid:sScoringUID, GUID:this.sGUID, incidentID:this.sIncidentID, eventID:this.sEventID, decisionID:sDecisionID});
	};

	/**
	 * Destroys the Page Object
	 */
	DecisionAbstract.prototype.destroy						= function(){
		//Logger.logDebug('DecisionAbstract.destroy() | ');
		this.sIncidentID	= null;
		this.sEventID		= null;
		this.prototype		= null;

		PageAbstract.prototype.destroy.call(this);
	};

	DecisionAbstract.prototype.toString						= function(){
		return 'framework/simulation/viewcontroller/DecisionAbstract';
	};

	return DecisionAbstract;
});
