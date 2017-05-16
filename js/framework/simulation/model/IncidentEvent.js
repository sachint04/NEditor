define([
	'jquery',
	'x2js',
	'framework/simulation/core/SIMScoreManager',
	'framework/simulation/model/Trigger',
	'framework/utils/EventDispatcher',
	'framework/utils/Timer',
	'framework/utils/VariableManager',
	'framework/utils/globals',
	'framework/utils/Logger'
], function($, X2JS, SIMScoreManager, Trigger, EventDispatcher, Timer, VariableManager, Globals, Logger){

	function IncidentEvent(p_xmlEventNode) {
		//Logger.logDebug('IncidentEvent.CONSTRUCTOR() | Event XML = '/*+Globals.toXMLString(p_xmlEventNode)*/);
		EventDispatcher.call(this);

		this.sID;
		this.sIncidentID;
		this.sEventName;
		this.nLife;
		this.nTimeLimit;
		this.bExpires;
		this.nPriority;
		this.nMaxPossibleScore;
		//this.sTransitionText;

		this.oPageText;
		this.aTriggers;
		this.oMapping;
		this.oResultTriggers;
		this.x2jsTransition;
		this.oHowToProceed;
		this.aDecisionPageModels = [];

		//this.nCurrentTriggerIndex = 0;
		/*
		 * NOTSTARTED	- Event has not started.
		 * INCOMPLETE	- Event started but not completed.
		 * COMPLETED 	- Event completed.
		 * DEFERRED		- Event postponed to next day.
		 * FAILED		- Event lost forever due to non-completion and time limit expiry.
		 */
		this.sStatus = 'NOTSTARTED';
		/*
		 * NOTSTARTED	- Event is NOT Triggered
		 * STARTED		- Event is Triggered
		 * ACTIVE		- Event is Acted upon
		 * INACTIVE		- Event has been left in the middle
		 * DEFERRED		- Event postponed to next day.
		 * TIMEEXPIRED	- Event was not activated in time
		 * COMPLETED	- Event has been completed
		 * FAILED		- Event lost forever due to non-completion and time limit expiry.
		 */
		this.sState = 'NOTSTARTED';

		this.nDaysDeferred = 0;
		this.nDecisionPageIndex   = 0;
		this.aResultTriggersList;
		this.oTimer;

		this._parseEventNode(p_xmlEventNode);
	}

	IncidentEvent.prototype 								= Object.create(EventDispatcher.prototype);
	IncidentEvent.prototype.constructor 					= IncidentEvent;

	IncidentEvent.prototype._parseEventNode					= function(p_xmlEventNode){
		this.oPageText = {};
		var oScope = this,
			$eventNode = $(p_xmlEventNode);
		//Logger.logDebug('IncidentEvent._parseEventNode() | '+p_xmlEventNode);

		this.sID 					= String($eventNode.attr('id'));
		this.sIncidentID 			= String($eventNode.attr('incidentid'));
		this.sEventName 			= $eventNode.attr('name');
		this.nLife 					= Number($eventNode.attr('life')) || 1;
		this.nTimeLimit 			= Number($eventNode.attr('timeLimit')) || -1;
		this.bExpires 				= ($eventNode.attr('expires') == 'true') ? true : false;
		this.nPriority 				= Number($eventNode.attr('priority')) || -1;
		this.nMaxPossibleScore 		= Number($eventNode.attr('maxScore')) || 0;

		$eventNode.children().each(function(index, element){
			var sNodeName = element.nodeName.toUpperCase();
			//Logger.logDebug('IncidentEvent._parseEventNode() | Node Name = '+sNodeName+' : '+Globals.getContent(element));
			switch(sNodeName){
				case 'PAGETEXT' :
					var id = element.getAttribute('id');
					oScope.oPageText[id] = Globals.getContent(element);
					//oScope.sTransitionText = Globals.getContent(element);
					break;
				case 'TRIGGERS' :
					oScope.parseTriggers(element);
					break;
				case 'MAPPING' :
					oScope.parseMapping(element);
					break;
				/*
				case 'RESULTTRIGGERS' :
									oScope.parseResultTriggers(element);
									break;*/
				case 'HOWTOPROCEED' :
					oScope.parseHowToProceed(element);
					break;
				case 'TRANSITION' :
					var oX2JS = new X2JS();
					oScope.x2jsTransition = oX2JS.xml2json(element);
					break;
			}
		});
		//Logger.logDebug('IncidentEvent._parseEventNode() | Page Text = '+JSON.stringify(oScope.oPageText));
	};

	IncidentEvent.prototype.parseTriggers					= function(p_xmlTriggersNode){
		//Logger.logDebug('IncidentEvent.parseTriggers()');
		this.aTriggers = [];
		var oScope = this,
			$triggers = $(p_xmlTriggersNode);

		$triggers.children().each(function(i, element){
			var sNodeName = element.nodeName.toUpperCase();
			//Logger.logDebug('IncidentEvent.parseTriggers() | Node Name = '+sNodeName);
			var oTrigger = new Trigger(oScope, element);
			oScope.aTriggers.push(oTrigger);
		});

		this.addTriggerListeners();
	};
	IncidentEvent.prototype.addTriggerListeners				= function(){
		//Logger.logDebug('IncidentEvent.addTriggerListeners() | Incident ID = '+this.getIncidentID()+' : Event ID = '+this.getID());
		var oTrigger,
			i;

		this.handleEvents = this.handleEvents.bind(this);

		for(i=0; i<this.aTriggers.length; i++){
			oTrigger	= this.aTriggers[i];
			oTrigger.addEventListener('FIRE_TRIGGER', this.handleEvents);
		}
	};
	IncidentEvent.prototype.removeTriggerListeners			= function(){
		//Logger.logDebug('IncidentEvent.removeTriggerListeners() | Incident ID = '+this.getIncidentID()+' : Event ID = '+this.getID());
		var oTrigger,
			i;

		for(i=0; i<this.aTriggers.length; i++){
			oTrigger	= this.aTriggers[i];
			//Logger.logDebug('\tREMOVING Trigger ID = '+oTrigger.getID());
			oTrigger.removeEventListener('FIRE_TRIGGER', this.handleEvents);
		}
	};
	IncidentEvent.prototype.removeAllListeners				= function(){
		var oTrigger,
			i;

		for(i=0; i<this.aTriggers.length; i++){
			oTrigger	= this.aTriggers[i];
			// ** Do not remove listeners for Triggers which have their timer in started state
			if(!oTrigger.isTimed()){
				oTrigger.removeEventListener('FIRE_TRIGGER', this.handleEvents);
			}
		}
		if(this.oTimer){
			this.oTimer.destroy();
		}
	};
	IncidentEvent.prototype.getTimedTriggers				= function(){
		var oTrigger,
			aList		= [],
			i;

		for(i=0; i<this.aTriggers.length; i++){
			oTrigger	= this.aTriggers[i];
			if(oTrigger.isTimed()){
				aList.push(oTrigger);
			}
		}
		return aList;
	};
	IncidentEvent.prototype.removeTimedTriggerListeners		= function(){
		//Logger.logDebug('IncidentEvent.removeTimedTriggerListeners() | ');
		var oTrigger,
			i;

		for(i=0; i<this.aTriggers.length; i++){
			oTrigger	= this.aTriggers[i];
			if(oTrigger.isTimed()){
				oTrigger.stopTimer();
			}
		}
	};

	/*
	   this.oMapping = {
                          "decisionGroup": [
                            {
                              "decision": [
                                {
                                  "_id": "decision1",
                                  "_selectedOptions": "",
                                  "_scoreRange": "4-4"
                                },
                                {
                                  "_id": "decision1",
                                  "_selectedOptions": "",
                                  "_scoreRange": "4-4"
                                }
                              ],
                              "_triggerID": "2",
                              "_gotoEventId": "",
                              "_enableIncident": ""
                            },
                            {
                              "decision": {
                                "_id": "decision1",
                                "_selectedOptions": "",
                                "_scoreRange": "0-3"
                              },
                              "_triggerID": "3",
                              "_gotoEventId": "2",
                              "_enableIncident": ""
                            }
                          ]
                        }
	 */
	IncidentEvent.prototype.parseMapping					= function(p_xmlMappingNode){
		var oX2JS = new X2JS();
        this.oMapping = oX2JS.xml2json(p_xmlMappingNode);
		//Logger.logDebug('IncidentEvent.parseMapping() | '+JSON.stringify(this.oMapping));
	};

	/*IncidentEvent.prototype.parseResultTriggers				= function(p_xmlResultTriggersNode){
		Logger.logDebug('IncidentEvent.parseResultTriggers()');
		this.oResultTriggers = {};
		var oScope = this,
			$resultTriggers = $(p_xmlResultTriggersNode);

		$resultTriggers.children().each(function(i, element){
			var sNodeName = element.nodeName.toUpperCase();
			var $resultTrigger = $(element);
			//Logger.logDebug('IncidentEvent.parseResultTriggers() | Node Name = '+sNodeName+' : '+$resultTrigger.attr('id')+' : '+$resultTrigger.attr('type'));
			var oResultTrigger = {id		: $resultTrigger.attr('id'),
								  type		: $resultTrigger.attr('type')};
			oResultTrigger.text = {};

			$resultTrigger.children().each(function(j, childElement){
				oResultTrigger.text[childElement.getAttribute('id')] = Globals.getContent(childElement);
			});

			oScope.oResultTriggers[oResultTrigger.id] = oResultTrigger;
		});
	};*/

	IncidentEvent.prototype.parseHowToProceed				= function(p_xmlHowToProceedNode){
		//Logger.logDebug('IncidentEvent.parseHowToProceed()');
		this.oHowToProceed = {};
		var oScope = this,
			$htp = $(p_xmlHowToProceedNode);

		$htp.children().each(function(index, element){
			var sNodeName = element.nodeName.toUpperCase();
			//Logger.logDebug('IncidentEvent.parseHowToProceed() | Node Name = '+sNodeName+' :: '+Globals.getContent(element));

			oScope.oHowToProceed[element.getAttribute('id')] = Globals.getContent(element);
		});
	};

	IncidentEvent.prototype.handleEvents					= function(e){
		var oTarget			= e.target,
			sEventType		= e.type;
		//Logger.logDebug('IncidentEvent.handleEvents() | Event Type = '+sEventType);
		switch(sEventType){
			case 'FIRE_TRIGGER' :
				oTarget.removeEventListener('FIRE_TRIGGER', this.handleEvents);
				this.dispatchEvent('NEW_TRIGGER', {type:'NEW_TRIGGER', target:this, incidentID:this.sIncidentID, eventID:this.sID, trigger:e.target});
				break;
			case 'TIME_OVER' :
				this.stopTimer();
				this.setState('TIMEEXPIRED');
				if(this.bExpires){this.setStatus('FAILED');}
				this.dispatchEvent('EVENT_TIME_EXPIRED', {type:'EVENT_TIME_EXPIRED', target:this});
				break;
		}
	};

	IncidentEvent.prototype.addDecisionPage					= function(p_oPageModel){
		//Logger.logDebug('IncidentEvent.addDecisionPage() | Page Model '+JSON.stringify(p_oPageModel));
		this.aDecisionPageModels.push(p_oPageModel);
	};

	IncidentEvent.prototype.getDecisionPageModelList		= function(){
		//Logger.logDebug('IncidentEvent.getDecisionPageModelList() | Page Models Length = '+this.aDecisionPageModels.length);
		return this.aDecisionPageModels;
	};

	IncidentEvent.prototype.getDecisionPageModel			= function(){
		//Logger.logDebug('IncidentEvent.getDecisionPageModel() | Event '+this.sID+' : State = '+this.sState);
		/*if(this.sState === 'ACTIVE'){

		}else{*/
			return this.aDecisionPageModels[this.nDecisionPageIndex];
		//}
	};

	IncidentEvent.prototype.start 							= function(){
		//Logger.logDebug('IncidentEvent.start() | Event ID '+this.sID);
		// ** Arrange Decision Pages as per their Order
		this.aDecisionPageModels.sort(function(a, b){
			return a.getOrder()-b.getOrder();
		});
		this.setState('STARTED');
		this.setStatus('INCOMPLETE');
	};

	IncidentEvent.prototype.getID							= function(){return this.sID;};
	IncidentEvent.prototype.getIncidentID 					= function(){return this.sIncidentID;};
	IncidentEvent.prototype.getEventName 					= function(){return this.sEventName;};
	IncidentEvent.prototype.getLife							= function(){return this.nLife;};
	IncidentEvent.prototype.getLifeLeft						= function(){return (this.nLife - this.nDaysDeferred);};
	IncidentEvent.prototype.getTimeLimit					= function(){return this.nTimeLimit;};
	IncidentEvent.prototype.hasExpiry						= function(){return this.bExpiry;};
	IncidentEvent.prototype.getPriority						= function(){return this.nPriority;};
	IncidentEvent.prototype.getMaxPossibleScore				= function(){return this.nMaxPossibleScore;};
	/*
	IncidentEvent.prototype.getTransitionText				= function(){
			return this.oPageText.transition;
			//return this.sTransitionText;
		};*/
	IncidentEvent.prototype.getPageText						= function(p_sTextID){
		var sText = this.oPageText[p_sTextID];
		if(sText){return sText;}
		Logger.logWarn('IncidentEvent.getPageText() | WARN: Page Text with ID "'+p_sTextID+'" not found');
	};

	IncidentEvent.prototype.getTransitionText 				= function(){
		return this.x2jsTransition;
	};
	IncidentEvent.prototype.getHowToProceed 				= function(){
		return this.oHowToProceed;
	};

	IncidentEvent.prototype.isOver							= function(){
		//Logger.logDebug('IncidentEvent.isOver() | STATUS = '+this.sStatus+' : '+(this.sStatus === 'FAILED' || this.sStatus === 'COMPLETED'));
		if(this.sStatus === 'FAILED' || this.sStatus === 'COMPLETED'){return true;}
		return false;
	};
	IncidentEvent.prototype.getStatus						= function(){ return this.sStatus; };
	IncidentEvent.prototype.setStatus						= function(p_sStatus){
		var sStatus = p_sStatus.toUpperCase();
		if(this.sStatus === sStatus || this.sStatus === 'FAILED' || this.sStatus === 'COMPLETED' || sStatus === 'NOTSTARTED'){return;}
		Logger.logDebug('IncidentEvent.setStatus() | Incident ID = '+this.getIncidentID()+' : Event ID = '+this.sID+'\n\tPrev Status = '+this.sStatus+' : Curr State = '+p_sStatus);
		if(sStatus === 'NOTSTARTED' || sStatus === 'INCOMPLETE' || sStatus === 'DEFERRED' || sStatus === 'FAILED' || sStatus === 'COMPLETED'){
			this.sStatus = sStatus;
			this.dispatchEvent('EVENT_STATUS_CHANGE', {type:'EVENT_STATUS_CHANGE', target:this});
			return;
		}
		Logger.logError('IncidentEvent.setStatus() | Invalid parameter "'+p_sStatus+'" cannot be set as Events Status');
	};

	IncidentEvent.prototype.getState						= function(){ return this.sState; };
	IncidentEvent.prototype.setState						= function(p_sState){
		var sState = p_sState.toUpperCase();
		if(this.sState === sState || this.sState === 'FAILED' || this.sState === 'TIMEEXPIRED' || this.sState === 'COMPLETED' || sState === 'NOTSTARTED'){return;}
		Logger.logDebug('IncidentEvent.setState() | Incident ID = '+this.getIncidentID()+' : Event ID = '+this.sID+'\n\tPrev State = '+this.sState+' : Curr State = '+sState);
		if(sState === 'NOTSTARTED' || sState === 'STARTED' || sState === 'ACTIVE' || sState === 'INACTIVE' || sState === 'DEFERRED' || sState === 'TIMEEXPIRED' || sState === 'COMPLETED' || sState === 'FAILED'){
			this.checkEventParameters(this.sState, sState);
			this.sState = sState;
			this.dispatchEvent('EVENT_STATE_CHANGE', {type:'EVENT_STATE_CHANGE', target:this});
			return;
		}
	};
	IncidentEvent.prototype.checkEventParameters			= function(p_sPrevState, p_sCurrState){
		// ** The Event is being initialized for the first time
		if(p_sPrevState === 'NOTSTARTED' && p_sCurrState === 'STARTED'){
			if(this.nTimeLimit > 0){
				this.startTimer();
			}
		}
		if(p_sCurrState === 'DEFERRED'){this.incrementDaysDeferred();}
		if(p_sCurrState === 'STARTED'){this.decrementDaysDeferred();}
	};
	IncidentEvent.prototype.startTimer						= function(){
		//Logger.logDebug('IncidentEvent.startTimer() | Time Limit = '+this.nTimeLimit);
		this.oTimer = new Timer();
		this.oTimer.setEndTime(this.nTimeLimit * 60);

		this.handleEvents = this.handleEvents.bind(this);
		this.oTimer.addEventListener('TIME_OVER', this.handleEvents);
		this.oTimer.start();
	};
	IncidentEvent.prototype.stopTimer						= function(){
		//Logger.logDebug('IncidentEvent.stopTimer() | ');
		if(this.oTimer){
			this.oTimer.stop();
			this.oTimer.removeEventListener('TIME_OVER', this.handleEvents);
		}
	};



	IncidentEvent.prototype.getDaysDeferred					= function(){ return this.nDaysDeferred; };
	IncidentEvent.prototype.incrementDaysDeferred			= function(){
		if(this.nDaysDeferred < this.nLife){this.nDaysDeferred++;}
		Logger.logDebug('IncidentEvent.incrementDaysDeferred() | '+this.getEventDescription()+'\n\tDays Deferred = '+this.nDaysDeferred+'\n\tLife = '+this.nLife);
	};
	IncidentEvent.prototype.decrementDaysDeferred			= function(){
		if(this.nDaysDeferred > 0){this.nDaysDeferred--;}
		//Logger.logDebug('IncidentEvent.decrementDaysDeferred() | '+this.getEventDescription()+'\n\tDays Deferred = '+this.nDaysDeferred+'\n\tLife = '+this.nLife);
	};

	IncidentEvent.prototype.isDependant						= function(){
		//Logger.logDebug('IncidentEvent.isDependant() | sGoToEventID = '+p_sGoToEventID);
	};
	IncidentEvent.prototype.getDependantEvents				= function(){
		//Logger.logDebug('IncidentEvent.getDependantEvents() | Incident ID = '+this.sIncidentID+' : Event ID = '+this.sID);
		var aDecisionGroupList				= this.oMapping.decisionGroup,
        	nDecisionGroupLength			= aDecisionGroupList.length,
        	aDependantEventIDList			= [],
        	oDecisionGroupPointer,
        	sGoToEventID,
        	nGoToEventIDIndex,
        	i;
        if(nDecisionGroupLength){
        	// ** Multiple Decision Groups
	        //Logger.logDebug('\tMultiple "Decision Groups"');
        	for(i = 0; i < nDecisionGroupLength; i++){
        		oDecisionGroupPointer	= aDecisionGroupList[i];
        		sGoToEventID			= oDecisionGroupPointer._gotoEventId || '';
		        aDependantEventIDList	= this.addToDependantEvents(sGoToEventID, aDependantEventIDList);
        	}
        }else{
	        //Logger.logDebug('\tSingle "Decision Group"');
	        oDecisionGroupPointer		= aDecisionGroupList;
	        sGoToEventID				= oDecisionGroupPointer._gotoEventId || '';
	        aDependantEventIDList		= this.addToDependantEvents(sGoToEventID, aDependantEventIDList);
        }

		/*
		 * If the accumulated GoToEventID's contain an Event ID which matches
		 * an Event ID in the "decisionGroupDefault" node then remove that Event ID from the Dependant Events List
		 */
        oDecisionGroupPointer	= (this.oMapping.decisionGroupDefault) ? this.oMapping.decisionGroupDefault : null;
        if(oDecisionGroupPointer){
        	sGoToEventID			= oDecisionGroupPointer._gotoEventId || '',
        	aGoToEventIDList		= Globals.trim(sGoToEventID).split(','),
        	aGoToEventIDListLength	= aDependantEventIDList.length,
        	i;

        	for (i=0; i < aGoToEventIDListLength; i++) {
				sGoToEventID		= aGoToEventIDList[i];
	        	nGoToEventIDIndex	= aDependantEventIDList.indexOf(sGoToEventID);
	        	if(nGoToEventIDIndex > -1){
	        		//Logger.logDebug('\tRemoving Event ID "'+sGoToEventID+'" from Dependant List');
	        		// ** Remove this Event ID from the list of dependant ID's
	        		aDependantEventIDList.splice(nGoToEventIDIndex, 1);
	        	}
			};
        }

        Logger.logDebug('\tDependant Events List = '+aDependantEventIDList);
        return aDependantEventIDList;
	};
	IncidentEvent.prototype.addToDependantEvents			= function(p_sGoToEventID, p_aDependantEventIDList){
		//Logger.logDebug('IncidentEvent.getDependantEvents() | sGoToEventID = '+p_sGoToEventID+' : aDependantEventIDList = '+p_aDependantEventIDList);
		if(p_sGoToEventID != '' && p_aDependantEventIDList.indexOf(p_sGoToEventID) < 0){
			p_aDependantEventIDList.push(p_sGoToEventID);
		}
		return p_aDependantEventIDList;
	};

	// ** Called by the Incident Controller Class when a decision is completed
	//IncidentEvent.prototype.evaluateDecision 				= function(p_oDecisionData, p_sDecisionID){
	IncidentEvent.prototype.evaluateDecision 				= function(){
        //Logger.logDebug('IncidentEvent.evaluateDecision() | \nDecision Page Index = '+this.nDecisionPageIndex+' < Decision Page Models Length = '+(this.aDecisionPageModels.length - 1)+' :::: '+(this.nDecisionPageIndex < (this.aDecisionPageModels.length - 1)));
        // ** TODO: Decision Page Branching if any needs to be done here. Current scope doesnot account for this, hence returning the next decision page model if any or dispatching the EVENT_COMPLETE event
        if(this.nDecisionPageIndex < (this.aDecisionPageModels.length - 1)){
            this.nDecisionPageIndex++;
	        this.dispatchEvent('NEXT_DECISION', {type:'NEXT_DECISION', target:this, incidentID:this.sIncidentID, eventID:this.sID});
            return false;
        }

        this.evaluateAllDecisions();
        return true;
	};

	// ** Called when all decisions are completed
	IncidentEvent.prototype.evaluateAllDecisions 			= function(){
        //Logger.logDebug('IncidentEvent.evaluateAllDecisions() | ');
        var aDecisionGroupList				= this.oMapping.decisionGroup,
        	nDecisionGroupLength			= aDecisionGroupList.length,
        	i;
        if(nDecisionGroupLength){
        	// ** Multiple Decision Groups
	        //Logger.logDebug('\tMultiple "Decision Groups"');
        	for(i = 0; i < nDecisionGroupLength; i++){
				var aDecision			= aDecisionGroupList[i].decision,
					nDecisionLength		= aDecision.length;
				if(nDecisionLength){
		        	// ** Multiple Decisions in a Group
			        //Logger.logDebug('\tMultiple "Decisions" in a "Decision Group"');
		        	for(j = 0; j < nDecisionLength; j++){
		        		var bValid	= this.validateDecisionData(aDecision[j]);
		        		if(!bValid){continue;}
		        		if(bValid && j === (nDecisionLength-1)){
					        //Logger.logDebug('\tIN');
			        		this.allDecisionsEvaluationComplete(aDecisionGroupList[i]);
		        			return true;
		        		}
					}
				}else{
			        //Logger.logDebug('\tSingle "Decisions" in a "Decision Group"');
					if(this.validateDecisionData(aDecision)){
				        //Logger.logDebug('\tIN');
		        		this.allDecisionsEvaluationComplete(aDecisionGroupList[i]);
		        		return true;
					}
				}
        	}
        }else{
	        //Logger.logDebug('\tSingle "Decision Group"');
        	if(this.validateDecisionData(aDecisionGroupList.decision)){
		        //Logger.logDebug('\tIN');
        		this.allDecisionsEvaluationComplete(aDecisionGroupList);
        		return true;
        	}
        }

        Logger.logWarn('IncidentEvent.evaluateAllDecisions() | WARN: Matching Decision nodes not found in the Decision Map');
        var oDefaultDecisionGroup	= (this.oMapping.decisionGroupDefault) ? this.oMapping.decisionGroupDefault : null;
        this.allDecisionsEvaluationComplete(oDefaultDecisionGroup);
        return false;
	};

    IncidentEvent.prototype.allDecisionsEvaluationComplete	= function(p_oDecisionGroup){
		var aResultTrigerIDs	= [],
	    	aGotoEventID		= [],
	    	nDaysToNextEvent,
	    	aEnableIncident		= [],
			temp;

    	if(p_oDecisionGroup){
	    	temp				= Globals.trim(p_oDecisionGroup._triggerID),
    		aResultTrigerIDs	= (temp !== '') ? temp.split(',') : [],
    		temp				= Globals.trim(p_oDecisionGroup._gotoEventId),
    		aGotoEventID		= (temp !== '') ? temp.split(',') : [],
    		nDaysToNextEvent	= Number(Globals.trim(p_oDecisionGroup._daysToNextEvent)) || 0,
    		temp				= Globals.trim(p_oDecisionGroup._enableIncident),
    		aEnableIncident		= (temp !== '') ? temp.split(',') : [];
    	}

    	if(aGotoEventID.length > 1){Logger.logError('IncidentEvent.allDecisionsEvaluationComplete() | ERROR : Multiple Event IDs found for "gotoEvent" attribute in the Decision Mapping node. It should hold only 1 Event ID value.\nError Location: Incident ID: "'+this.getIncidentID()+'" Event ID: "'+this.getID()+'"');}

		// ** Updating State, Status and Setting Result Triggers
		this.aResultTriggersList = aResultTrigerIDs;
		this.setState('COMPLETED');
		this.setStatus('COMPLETED');
        //Logger.logDebug('IncidentEvent.allDecisionsEvaluationComplete() | Incident ID = '+this.getIncidentID()+' : Event ID = '+this.getID()+' : Event Name = '+this.getEventName()+'\n\tResult Trigger IDs = '+aResultTrigerIDs+'\n\tGo To Event ID = '+aGotoEventID+'\n\tEnable Incident = '+aEnableIncident);

        // ** Jump to the next linked Event ID
        /*if(aGotoEventID.length > 0 && nDaysToNextEvent == 0){
            this.dispatchEvent('GOTO_EVENT', {type:'GOTO_EVENT', target:this, gotoEventID:aGotoEventID[0], daystoNextEvent:nDaysToNextEvent});
        }else if(aGotoEventID.length > 0 && nDaysToNextEvent > 0){
            this.dispatchEvent('HIBERNATE_GOTO_EVENT', {type:'HIBERNATE_GOTO_EVENT', target:this, gotoEventID:aGotoEventID[0], daystoNextEvent:nDaysToNextEvent});
        }*/
		var oEventObject	= {
        		type			: 'EVENT_COMPLETE',
        		target			: this
        };
        if(aGotoEventID.length > 0){
        	oEventObject.gotoEventID		= aGotoEventID[0];
        	oEventObject.daystoNextEvent	= nDaysToNextEvent;
	        //this.dispatchEvent('GOTO_EVENT', {type:'GOTO_EVENT', target:this, gotoEventID:aGotoEventID[0], daystoNextEvent:nDaysToNextEvent});
        }

        // ** Enabling dependant Incidents
        if(aEnableIncident.length > 0){
        	oEventObject.enableIncidents	= aEnableIncident;
        }

        //this.dispatchEvent('EVENT_COMPLETE', {type:'EVENT_COMPLETE', target:this, incidentID:this.sIncidentID, eventID:this.sID, incidentComplete:bIncidentComplete});
        //this.dispatchEvent('EVENT_COMPLETE', {type:'EVENT_COMPLETE', target:this});
        this.dispatchEvent('EVENT_COMPLETE', oEventObject);
		this.removeAllListeners();
    };

	IncidentEvent.prototype.validateDecisionData			= function(p_oDecision){
        //Logger.logDebug('IncidentEvent.validateDecisionData() | '/*+JSON.stringify(p_oDecision)*/);
        var sDecisionID				= p_oDecision._id,
        	aDecisionIDs			= (sDecisionID.indexOf(',') > -1) ? sDecisionID.split(',') : null,
        	sSelectedOptions		= Globals.trim(p_oDecision._selectedOptions) || null,
        	//aSelectedOptions		= (oSelectedOptions && typeof oSelectedOptions === 'object' && oSelectedOptions.length) ? sSelectedOptions.split(',') : null,

        	temp					= Globals.trim(p_oDecision._scoreRange),
        	aScoreRange				= (temp !== '') ? temp.split('-') : [],

        	oDecisionScore,
			nAchievedPointsScore,
			nAchievedPercentScore,
			aUserScore,
			nMaxPossibleScore,
			aUserSelections,
			i;

		if(aDecisionIDs){
			nAchievedPointsScore	= 0;
			nAchievedPercentScore	= 0;
			aUserScore				= [];
			nMaxPossibleScore		= 0;
			aUserSelections			= [];

			for (var i=0; i < aDecisionIDs.length; i++) {
				var sDecisionID	= aDecisionIDs[i];
				oDecisionScore			= this.getDecisionData(sDecisionID);
				nAchievedPointsScore	+= oDecisionScore.getScore();
				nAchievedPercentScore	+= oDecisionScore.getPercentScore();
				aUserScore.push(oDecisionScore.getUserScores());
				nMaxPossibleScore		+= oDecisionScore.getMaxPossibleScore();
				aUserSelections.push(oDecisionScore.getUserSelections());
			};

			nAchievedPercentScore = (nAchievedPointsScore * 100 / nMaxPossibleScore);
			Logger.logDebug(':: nAchievedPercentScore :: '+nAchievedPercentScore);
		}else{
			oDecisionScore			= this.getDecisionData(sDecisionID);
			nAchievedPointsScore	= oDecisionScore.getScore();
			nAchievedPercentScore	= oDecisionScore.getPercentScore();
			aUserScore				= oDecisionScore.getUserScores();
			nMaxPossibleScore		= oDecisionScore.getMaxPossibleScore();
			aUserSelections			= oDecisionScore.getUserSelections();
		}

		// ** The Decision Data would not exist if the Time for the Event Expired and The Decisions in this Event didn't get completed
		if(oDecisionScore){
			if(sSelectedOptions){
				var sUserSelections		= JSON.stringify(aUserSelections);
				Logger.logDebug(':: String Comparision ::');
				Logger.logDebug('\tSelected Options = '+sSelectedOptions+'\n\tUser Selections = '+sUserSelections+'\n\tType of Selected Options = '+(typeof sSelectedOptions)+'\n\tType of User Selections = '+(typeof sUserSelections)+'\n\tEvaluate = '+(sSelectedOptions === sUserSelections));

				// ** Try String Comparision
				if(sSelectedOptions !== sUserSelections){
					Logger.logDebug('\tSTRING DIDNT MATCH');
					// ** Try Array Comparision
					var oSelectedOptions = JSON.parse(sSelectedOptions);
					Logger.logDebug(':: Array Comparision ::');
					Logger.logDebug('\tSelected Options Length = '+oSelectedOptions.length+' : Selected Options = '+oSelectedOptions+'\n\tUser Selections Length = '+aUserSelections.length+' : User Selections = '+aUserSelections);

					if(oSelectedOptions.length > 0){
						for(i = 0; i < oSelectedOptions.length; i++){
							Logger.logDebug('\tChecking Selected Options | User Selection = '+aUserSelections[i]+' : Required Selection = '+oSelectedOptions[i]+' :: '+(oSelectedOptions[i] === aUserSelections[i]));
							if(oSelectedOptions[i] !== aUserSelections[i]){
								/*
								 * If Selected Options Mapping specified in the XML doesn't match the User Selections, then
								 * don't check for Score Range and other params if any. Just return false
								 */
								return false;
							}
						}
					}
				}
				Logger.logDebug('\tSTRING MATCHED');
			}

			Logger.logDebug(':: Score Comparision ::\n\tScore Range Length = '+aScoreRange.length+' : Score Range Values = '+aScoreRange);
			if(aScoreRange.length > 0){
				if(aScoreRange.length > 2){Logger.logError('IncidentEvent.validateDecisionData() | ERROR: Invalid Score Range for Incident ID "'+this.sIncidentID+'" Event ID "'+this.sID+'" Decision ID "'+sDecisionID+'".');}
				var nMinScoreRange	= Number(aScoreRange[0]),
					nMaxScoreRange	= Number(aScoreRange[1]),
					bIsInRange		= (nAchievedPercentScore >= nMinScoreRange && nAchievedPercentScore <= nMaxScoreRange) ? true : false;
				Logger.logDebug('\tMin = '+nMinScoreRange+' : Max = '+nMaxScoreRange+' : User % Score = '+nAchievedPercentScore+'\n\tEvaluate = '+bIsInRange);

				return bIsInRange;
			}

			/*
			 * If both, Selected Options Mapping & Score Range mapping are NOT specified in the XML
			 * OR if the Selected Options Mapping in the XML matched the User Selections return TRUE
			 */
			return true;
		}else{
			return false;
		}
	};

	/*IncidentEvent.prototype.enumerate						= function(p_xmlMapSelectedOptions, p_aUserSelections, p_sTabs){
		var i,
			xmlMapSelectedOptionsPointer,
			userSelectedOptionsPointer,
			sTypeOfItem						= typeof p_xmlMapSelectedOptions;

		if(sTypeOfItem === 'object' && p_xmlMapSelectedOptions.length){
			for(i=0; i<p_xmlMapSelectedOptions.length; i++){
				xmlMapSelectedOptionsPointer	= p_xmlMapSelectedOptions[i];
				userSelectedOptionsPointer		= p_aUserSelections[i];
				sTypeOfItem						= typeof xmlMapSelectedOptionsPointer;

				if(sTypeOfItem === 'object' && xmlMapSelectedOptionsPointer.length){
					this.enumerate(xmlMapSelectedOptionsPointer, userSelectedOptionsPointer, p_sTabs+'\t');
					continue;
				}
				if(sTypeOfItem === 'object'){
					this.enumerate(xmlMapSelectedOptionsPointer, userSelectedOptionsPointer, p_sTabs+'\t');
					continue;
				}
				if(sTypeOfItem === 'string' || sTypeOfItem === 'number'){
					if (xmlMapSelectedOptionsPointer !== userSelectedOptionsPointer){
						return false;
					}
				}
				Logger.logDebug('\tChecking Selected Options | User Selection = '+aUserSelection[i]+' : Required Selection = '+aSelectedOptions[i]+' :: '+(aSelectedOptions[i] === aUserSelection[i]));
			}
		}else if(sTypeOfItem === 'object'){
			this.enumerate(p_xmlMapSelectedOptions, p_aUserSelections, p_sTabs+'\t');
		}else if(sTypeOfItem === 'string' || sTypeOfItem === 'number'){
			if (xmlMapSelectedOptionsPointer !== userSelectedOptionsPointer){
				return false;
			}
		}
	};*/

	IncidentEvent.prototype.getDecisionData 				= function(p_sDecisionID){
		/*
		 * p_sDecisionID - decision2~Q1
		 * 	@decision2	: The "data" attribute for he page in the course XML
		 * 	@Q1			: The "questionId" attribute value specified for the activity in the "Activity" XML node
		 */
		var sScoringUID		= this.getScoringUID(p_sDecisionID);
		Logger.logDebug('IncidentEvent.getDecisionData() | sScoringUID = '+sScoringUID);
		return SIMScoreManager.getScore(sScoringUID);

		/*var sDecisionUID	= this.sIncidentID + '_' + this.sID + '_' + p_sDecisionID;
		return SIMScoreManager.getScore(sDecisionUID);*/
	};

	IncidentEvent.prototype.getScoringUID					= function(p_sDecisionID){
		var oAllFeedbackData	= VariableManager.getVariable('decisionsFeedbackData'),
			sEventUID			= 'i_'+this.sIncidentID+'~e_'+this.sID,
			sDecisionID			= 'd_' + p_sDecisionID.split('~')[0],
			sQuestionID			= p_sDecisionID.split('~')[1];
		Logger.logDebug('IncidentEvent.getScoringUID() | EventUID = '+sEventUID+' : Decsion ID = '+sDecisionID+' : QuestionID = '+sQuestionID);

		for(var day in oAllFeedbackData){
			var oDayPointer	= oAllFeedbackData[day];
			for(var eventUID in oDayPointer){
				if(eventUID === sEventUID){
					var oEventPointer	= oDayPointer[eventUID];
					for(var decisionID in oEventPointer){
						if(decisionID === sDecisionID){
							var oDecisionPointer	= oEventPointer[decisionID],
								sScoringUID			= oDecisionPointer[sQuestionID];
							return sScoringUID;
						}
					}
				}
			}
		}
		Logger.logError('IncidentEvent.getScoringUID() | ERROR: No Scoring Object with ID "'+p_sDecisionID+'" not found. This could be due to a mismatch of the "id" attribute in the in "mapping > decisionGroup > decision" node');
	};

	// ** Used by the Triggers having STATE as COMPLETED
	IncidentEvent.prototype.getResultTriggerList			= function(){
		return this.aResultTriggersList;
	};

	IncidentEvent.prototype.destroy 						= function(){
		this.sID						= null;
		this.sIncidentID				= null;
		this.sEventName					= null;
		this.nLife						= null;
		this.nTimeLimit					= null;
		this.bExpires					= null;
		this.nPriority					= null;
		this.nMaxPossibleScore			= null;

		this.oPageText					= null;
		this.aTriggers					= null;
		this.oMapping					= null;
		this.oResultTriggers			= null;
		this.oHowToProceed				= null;
		this.x2jsTransition				= null;
		this.aDecisionPageModels 		= null;

		//this.nCurrentTriggerIndex 		= null;

		this.sStatus					= null;
		this.sState						= null;

		this.nDaysDeferred 				= null;
		this.nDecisionPageIndex   		= null;
		this.aResultTriggersList		= null;
		try{
			this.oTimer.stop();
		}catch(e){}
		this.oTimer						= null;
	};

	IncidentEvent.prototype.reset									= function(){
		Logger.logDebug('IncidentEvent.reset() | ');
		try{
			this.oTimer.stop();
		}catch(e){}
		this.sState					= 'NOTSTARTED';
		this.sStatus				= 'NOTSTARTED';
		this.nDecisionPageIndex		= 0;
		this.nDaysDeferred			= 0;
		this.removeTriggerListeners();
		this.addTriggerListeners();

		var oTrigger,
			i;

		for(i=0; i<this.aTriggers.length; i++){
			oTrigger		= this.aTriggers[i];
			oTrigger.reset();
		}
	};

	IncidentEvent.prototype.toString 						= function(){
		return 'framework/simulation/model/IncidentEvent';
	};

	IncidentEvent.prototype.getEventDescription				= function(){
		return 'Incident '+this.sIncidentID+' -> Event '+this.sID;
	};
	return IncidentEvent;
});