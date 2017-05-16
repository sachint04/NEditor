define([
	'jquery',
	'framework/simulation/model/IncidentEvent',
	'framework/utils/EventDispatcher',
	'framework/utils/globals',
	'framework/utils/Logger'
], function($, IncidentEvent, EventDispatcher, Globals, Logger){

	function Incident(p_sIncidentID, p_nIncidentDay, p_bIncidentDependant) {
		//Logger.logDebug('Incident.CONSTRUCTOR() | ID = '+p_sIncidentID+' : Day = '+p_nIncidentDay+' : Dependant = '+p_bIncidentDependant);
		EventDispatcher.call(this);

		this.sID								= p_sIncidentID;
		this.aIncidentEvent						= [];
		this.aDependantIncidentEvents			= [];// ** List of Event ID's which are listed in the "GoToEvent"

		// ** Refernce to the Incident Controller
		this.oIncidentControllerRef;
		this.sEventPrefix						= 'event_';

		this.onDayComplete	= this.onDayComplete.bind(this);
		this.onReset		= this.reset.bind(this);
		this.myEventHandler = this.handleEvent.bind(this);

		// ** << START - Bookmark Required >>
		this.nEventsPlayedToday;
		this.nEventsCompletedToday;
		this.bDependant = (p_bIncidentDependant === 'true') ? true : false;
		/* NOTSTARTED	- Incident has not started.
		 * INPROGRESS	- Incident started but not completed.
		 * COMPLETED 	- Incident completed. */
		this.sState						= 'NOTSTARTED';
		/* NOTSTARTED	- Incident has not started.
		 * INCOMPLETE	- Incident started but not completed.
		 * FAILED		- Incident Lost forever due to non-completion.
		 * DEFERRED		- Incident has been deferred for the current day.
		 * HIBERNATE	- Incident has Events which will trigger at some other day.
		 * COMPLETED 	- Incident completed. */
		this.sStatus = 'NOTSTARTED';
		// ** The GOTO EVENT ID is stored if the linked event belonging to this Incident is not to appear on the same day
		this.sGoToEventID = '';
		// ** This property has to be BOOKMARKED if the "sGoToEventID" property is set and the status is set to HIBERNATE
		this.nDay 		= (p_nIncidentDay) ? Number(p_nIncidentDay) : -1;
		this.nStoredDay = this.nDay;
		// ** << END - Bookmark Required >>
	}

	Incident.prototype 											= Object.create(EventDispatcher.prototype);
	Incident.prototype.constructor 								= Incident;

	Incident.prototype.setIncidentControllerReference			= function(p_oIncidentController){
		this.oIncidentControllerRef = p_oIncidentController;
		this.addIncidentControllerListeners();
	};
	Incident.prototype.addIncidentControllerListeners			= function(){
		//this.onDayComplete	= this.onDayComplete.bind(this);
		//this.onReset			= this.reset.bind(this);
		this.oIncidentControllerRef.addEventListener('DAY_COMPLETE', this.onDayComplete);
		this.oIncidentControllerRef.addEventListener('RESTART_SIM', this.onReset);
	};
	Incident.prototype.removeIncidentControllerListeners		= function(){
		//this.onDayComplete = this.onDayComplete.bind(this);
		this.oIncidentControllerRef.removeEventListener('DAY_COMPLETE', this.onDayComplete);
		this.oIncidentControllerRef.removeEventListener('RESTART_SIM', this.onReset);
	};

	Incident.prototype.addIncidentEvent 						= function(p_oIncidentEvent){
		//Logger.logDebug('Incident.addIncidentEvent() | '+p_oIncidentEvent+' INSTANCE '+(p_oIncidentEvent instanceof IncidentEvent));
		if(!p_oIncidentEvent instanceof IncidentEvent){Logger.logError('Incident.addEvent() | Invalid Parameter. Parameter needs to be an instance of an "IncidentEvent".');}
		this.aIncidentEvent[this.sEventPrefix + p_oIncidentEvent.getID()] = this.aIncidentEvent.length;
		this.aIncidentEvent.push(p_oIncidentEvent);
		this.addIncidentEventListeners(p_oIncidentEvent);
	};
	Incident.prototype.addIncidentEventListeners				= function(p_oIncidentEvent){
		//Logger.logDebug('Incident.addIncidentEventListeners() | '+p_oIncidentEvent+' $$$$$$$$$$ '+this);
		//this.myEventHandler = this.handleEvent.bind(this);
		p_oIncidentEvent.addEventListener('EVENT_STATE_CHANGE', this.myEventHandler);
		p_oIncidentEvent.addEventListener('EVENT_COMPLETE', this.myEventHandler);
		p_oIncidentEvent.addEventListener('EVENT_TIME_EXPIRED', this.myEventHandler);
		//p_oIncidentEvent.addEventListener('GOTO_EVENT', this.myEventHandler);
		//p_oIncidentEvent.addEventListener('HIBERNATE_GOTO_EVENT', this.myEventHandler);
	};
	Incident.prototype.removeIncidentEventListeners				= function(p_oIncidentEvent){
		//Logger.logDebug('Incident.removeIncidentEventListeners() | '+p_oIncidentEvent);
		//this.myEventHandler = this.handleEvent.bind(this);
		p_oIncidentEvent.removeEventListener('EVENT_STATE_CHANGE', this.myEventHandler);
		p_oIncidentEvent.removeEventListener('EVENT_COMPLETE', this.myEventHandler);
		p_oIncidentEvent.removeEventListener('EVENT_TIME_EXPIRED', this.myEventHandler);
		//p_oIncidentEvent.removeEventListener('GOTO_EVENT', this.myEventHandler);
		//p_oIncidentEvent.removeEventListener('HIBERNATE_GOTO_EVENT', this.myEventHandler);
	};
	Incident.prototype.initialize								= function(){
		//Logger.logDebug('Incident.initialize() | Incident ID = '+this.getID());
		var oIncidentEvent,
			aDependantEvents,
			aDependantEventsForOtherIncident	= [],
			sEventID,
			oIncidentEvent,
			i, j;

		for(i=0; i<this.aIncidentEvent.length; i++){
			oIncidentEvent		= this.aIncidentEvent[i];
			aDependantEvents	= oIncidentEvent.getDependantEvents();

			if(aDependantEvents.length > 0){
				for (j=0; j < aDependantEvents.length; j++) {
					sEventID		= aDependantEvents[j];
					//Logger.logDebug('\tEvent ID = '+sEventID);
					oIncidentEvent	= this.getEventByID(sEventID);
					// ** Remove the Event from the Dependant Events stack ONLY if it belongs to some other Incident
					if(!oIncidentEvent){
						var aRemovedItem	= aDependantEvents.splice(j, 1);
						aDependantEventsForOtherIncident.concat(aRemovedItem);
						j--;
					}
				};

				this.addDependantIncidentEvent(aDependantEvents);
			}
		}

		if(aDependantEventsForOtherIncident.length > 0){
			// ** TODO: Logic needs to be written here for dispatching an Event to the "IncidentController" and passing the "aDependantEventsForOtherIncident" list. The IncidentController needs to listen to this event and appropriately target the Incident to add the supplied ARRAY to its "aDependantIncidentEvents" stack.
		}
	};
	/*
	 * This Method is currently used internally by this Class.
	 * This will also be used by the "IncidentController" Class to add Dependant Incident Events
	 */
	Incident.prototype.addDependantIncidentEvent				= function(p_dependantIncidentEvents){
		this.aDependantIncidentEvents = (p_dependantIncidentEvents.length) ? this.aDependantIncidentEvents.concat(p_dependantIncidentEvents) : this.aDependantIncidentEvents.push(p_dependantIncidentEvents);
		//Logger.logDebug('Incident.addDependantIncidentEvent() | \n\tDependant Incident Events Length = '+p_dependantIncidentEvents.length+'\n\tthis.aDependantIncidentEvents = '+this.aDependantIncidentEvents);
	};

	Incident.prototype.getID 									= function(){ return this.sID; };
	//Incident.prototype.setDay 									= function(p_nDay){this.nDay = p_nDay; };
	Incident.prototype.getDay 									= function(){ return this.nDay; };
	Incident.prototype.isDependant 								= function(){ return this.bDependant; };
	Incident.prototype.removeDependantFlag						= function(){this.bDependant = false;};
	Incident.prototype.getIncidentEventsPlayedToday				= function(){ return this.nEventsPlayedToday; };
	Incident.prototype.getIncidentEventsCompletedToday			= function(){ return this.nEventsCompletedToday; };
	Incident.prototype.setGoToEventID							= function(p_sGoToEventID){
		if(!this.getEventByID(sGoToEventID)){Logger.logError('Incident.setGoToEventID() | ERROR : Event with ID "'+p_sGoToEventID+'" not found in Incident with ID "'+this.sID+'".');}
		this.sGoToEventID = p_sGoToEventID;
	};

	Incident.prototype.start 									= function(){
		//Logger.logDebug('Incident.start() | Incident ID '+this.sID);
		this.setStatus('INCOMPLETE');
		this.setState('INPROGRESS');
	};
	Incident.prototype.getEvent									= function(){
		//Logger.logDebug('Incident.getEvent() | ');
		var oIncidentEvent,
			sIncidentEventID,
			sIncidentEventStatus,
			nIncidentEventListLength	= this.aIncidentEvent.length,
			i;

		/*
		 * If a "GoToEvent" exists then return that Incident Event
		 */
		if(this.sGoToEventID !== ''/* && this.sStatus === 'HIBERNATE'*/){
			oIncidentEvent		= this.getEventByID(this.sGoToEventID);
			this.sGoToEventID	= '';
			this.nDay			= -1;
			this.nEventsPlayedToday++;
			//Logger.logDebug('Incident.getEvent() | \n\tGo To Event Pointer Exists | Incident ID = '+this.sID+' : Event ID = '+oIncidentEvent.getID());
			return oIncidentEvent;
		}

		/*
		 * Return the Next Incident Event which is Not Triggered and is NOT Dependant
		 */
		for(i=0; i<nIncidentEventListLength; i++){
			oIncidentEvent			= this.aIncidentEvent[i];
			sIncidentEventID		= oIncidentEvent.getID();
			sIncidentEventStatus	= oIncidentEvent.getStatus();

			if((sIncidentEventStatus === 'NOTSTARTED' || sIncidentEventStatus === 'INCOMPLETE' || sIncidentEventStatus === 'DEFERRED') && !this.isIncidentEventDependant(sIncidentEventID)){
				this.nEventsPlayedToday++;
				//Logger.logDebug('Incident.getEvent() | \n\tIncident ID = '+this.sID+' : Event ID = '+oIncidentEvent.getID());
				return oIncidentEvent;
			}
		}

		// ** If the interpreter comes here it means that, either all the Events have already been played
		// ** OR the remaining Events are dependant on some other event and cannot trigger all by themselves
		return null;
	};

	Incident.prototype.isIncidentEventDependant					= function(p_sEventID){
		//Logger.logDebug('Incident.isIncidentEventDependant() | \n\tEvent ID = '+p_sEventID+' \n\tDependant Events = '+this.aDependantIncidentEvents);
		return (this.aDependantIncidentEvents.indexOf(p_sEventID) > -1);
	};

	// ** The 'STATE' here is ONLY used to determine whether the Events to be fired for a day have been completed
	Incident.prototype.getState									= function(){ return this.sState; };
	Incident.prototype.setState									= function(p_sState){
		var sState = p_sState.toUpperCase();
		if(this.sState === sState || this.sState === 'COMPLETED' || sState === 'NOTSTARTED'){return;}
		//Logger.logDebug('Incident.setState() | Incident ID = '+this.sID+' : State = '+p_sState);
		if(sState === 'NOTSTARTED' || sState === 'INPROGRESS' || sState === 'COMPLETED'){
			this.sState = sState;
			this.dispatchEvent('INCIDENT_STATE_CHANGE', {type:'INCIDENT_STATE_CHANGE', target:this});
			return;
		}
	};

	Incident.prototype.getStatus 								= function(){ return this.sStatus; };
	Incident.prototype.setStatus 								= function(p_sStatus){
		var sStatus = p_sStatus.toUpperCase();
		if(this.sStatus === sStatus || this.sStatus === 'FAILED' || this.sStatus === 'COMPLETED' || sStatus === 'NOTSTARTED'){return;}
		//Logger.logDebug('Incident.setStatus() | Incident ID = '+this.sID+' : Prev State = '+this.sStatus+' : Curr State = '+sStatus);
		if(sStatus === 'NOTSTARTED' || sStatus === 'INCOMPLETE'/* || sStatus === 'HIBERNATE'*/ || sStatus === 'DEFERRED' || sStatus === 'FAILED' || sStatus === 'COMPLETED'){
			this.sStatus = sStatus;
			this.dispatchEvent('INCIDENT_STATUS_CHANGE', {type:'INCIDENT_STATUS_CHANGE', target:this});
			return;
		}
		Logger.logError('Incident.setStatus() | Invalid parameter "'+sStatus+'" cannot be set as Incident Status');
	};
	Incident.prototype.updateStatus								= function(e){
		//Logger.logDebug('Incident.updateStatus() | ');
		var sEventType				= e.type,
			oIncidentEvent			= e.target,
			bFailed					= false,
			oIncidentEventPointer,
			sIncidentEventID,
			sIncidentEventStatus,
			i;

		this.removeIncidentEventListeners(oIncidentEvent);

		for (i=0; i < this.aIncidentEvent.length; i++) {
			oIncidentEventPointer	= this.aIncidentEvent[i];
			sIncidentEventID		= oIncidentEventPointer.getID();
			sIncidentEventStatus	= oIncidentEventPointer.getStatus();

			// ** TODO: Check If its Required : Mark the untrigered "GoToEvents" (Dependant Events) as COMPLETED, so that the "Incident" Objects STATUS gets correctly updated
			//Logger.logDebug('\tChecking Event ID '+sIncidentEventID+' : Event Is Over = '+oIncidentEventPointer.isOver()+' : Go To EventID = '+this.sGoToEventID);
			if(this.sGoToEventID && !oIncidentEventPointer.isOver()/* && !this.isIncidentEventDependant(sIncidentEventID)*/){
				//Logger.logDebug('\tINCOMPLETE Event ID  = '+sIncidentEventID);
				return;
			}
			if(sIncidentEventStatus === 'FAILED'){bFailed = true;}
		};

		(bFailed) ? this.setStatus('FAILED') : this.setStatus('COMPLETED');
		this.dispatchEvent('INCIDENT_COMPLETE', {type:'INCIDENT_COMPLETE', target:this});
	};
	Incident.prototype.isOver									= function(){
		//Logger.logDebug('Incident.isOver() | STATUS = '+this.sStatus+' : '+(this.sStatus === 'FAILED' || this.sStatus === 'COMPLETED'));
		if(this.sStatus === 'FAILED' || this.sStatus === 'COMPLETED'){return true;}
		return false;
	};

	Incident.prototype.handleEvent								= function(e){
		var sEventType				= e.type,
			oIncidentEvent			= e.target,
			sIncidentEventID		= oIncidentEvent.getID(),
			sIncidentEventState		= oIncidentEvent.getState(),
			sIncidentEventStatus	= oIncidentEvent.getStatus();
		Logger.logDebug('Incident.handleEvent() | Event Type = '+sEventType+'\n\tIncident ID = '+this.sID+' : Event ID = '+sIncidentEventID+' : Event State = '+sIncidentEventState+' : Event Status = '+sIncidentEventStatus);

		switch(sEventType){
			/*case "HIBERNATE_GOTO_EVENT":
				this.sGoToEventID	= e.gotoEventID;
				this.nDay			= e.daystoNextEvent + this.oIncidentControllerRef.getCurrentDay();
				Logger.logDebug('\t\tGo to Event ID = '+e.gotoEventID+' : Days to Next Event = '+e.daystoNextEvent);
				this.setStatus('HIBERNATE');
				break;
			case "GOTO_EVENT":
				this.sGoToEventID	= e.gotoEventID;
				this.nDay			= e.daystoNextEvent + this.oIncidentControllerRef.getCurrentDay();
				Logger.logDebug('\tGo to Event ID = '+e.gotoEventID+' : Days to Next Event = '+e.daystoNextEvent);
				if(e.daystoNextEvent === 0){
					this.dispatchEvent('GOTO_EVENT', {type:'GOTO_EVENT', target:this, gotoEventID:this.sGoToEventID, daystoNextEvent:this.nDay});
				}
				break;*/
			case "EVENT_STATE_CHANGE":
				if(sIncidentEventState === 'DEFERRED'){
					this.setStatus('DEFERRED');
				}
				if(sIncidentEventState === 'STARTED'){
					this.setStatus('INCOMPLETE');
				}
				if(sIncidentEventState === 'FAILED'){
					this.setStatus('FAILED');
				}
				break;
			case "EVENT_TIME_EXPIRED":
				this.updateStatus(e);
				break;
			case "EVENT_COMPLETE":
				var sGoToEventID		= e.gotoEventID,
		            nDaysToNextEvent	= e.daystoNextEvent,
		            aEnableIncidents	= e.enableIncidents;

				// ** Check if GoToEventID exists AND it belongs to this Incident
				if(sGoToEventID && this.getEventByID(sGoToEventID)){
					this.sGoToEventID		= e.gotoEventID;
					this.nDay				= (e.daystoNextEvent || 0) + this.oIncidentControllerRef.getCurrentDay();
					Logger.logDebug('\tGo to Event ID = '+e.gotoEventID+' : Days to Next Event = '+e.daystoNextEvent);
				};

				this.nEventsCompletedToday++;

				this.updateStatus(e);
				break;
			case "DAY_COMPLETE":
				this.onDayComplete(e);
				break;
		}
	};

	Incident.prototype.getEventStatus 							= function(p_sEventID){
		//Logger.logDebug('Incident.getEventStatus() | ');
		var oEvent	= this.getEventByID(p_sEventID);
		return oEvent.getStatus();
	};
	Incident.prototype.setEventStatus 							= function(p_sEventID, p_sStatus){
		//Logger.logDebug('Incident.setEventStatus() | ');
		var oEvent	= this.getEventByID(p_sEventID);
		oEvent.setStatus(p_sStatus);
	};

	Incident.prototype.getBookmark 								= function(p_sBookmark){
		Logger.logDebug('Incident.getBookmark() | ');
		// TODO:
	};
	Incident.prototype.parseBookmark 							= function(p_sBookmark){
		Logger.logDebug('Incident.parseBookmark() | ');
		// TODO:
	};

	Incident.prototype.getEventByID								= function(p_sEventID){
		//Logger.logDebug('Incident.getEventByID() | EventID = '+p_sEventID);
		var oEvent = this.aIncidentEvent[this.aIncidentEvent[this.sEventPrefix + p_sEventID]];
		if(!oEvent){ Logger.logError('Incident.getEventByID() | Invalid Parameter. Parameter needs to be an instance of an "IncidentEvent". Event with ID"'+p_sEventID+'" not found.'); }
		return oEvent;
	};

	Incident.prototype.resetDayRuntimes							= function(){
		this.nEventsPlayedToday		= 0;
		this.nEventsCompletedToday	= 0;
	};

	// ** Mark all Events that were not attempted by the user as "FAILED"
	Incident.prototype.onDayComplete							= function(){
		Logger.logDebug('Incident.onDayComplete() | Incident ID = '+this.getID());
		var oIncidentEvent,
			sIncidentState,
			bFlag,
			i;

		for (i=0; i < this.aIncidentEvent.length; i++) {
			oIncidentEvent	= this.aIncidentEvent[i];
			sIncidentState	= oIncidentEvent.getState();
			bFlag			= (sIncidentState === 'STARTED' || sIncidentState === 'ACTIVE' || sIncidentState === 'INACTIVE');
			Logger.logDebug('\tEvent ID = '+oIncidentEvent.getID()+' : Event Over = '+oIncidentEvent.isOver()+' : Started = '+bFlag+' : Life Left = '+oIncidentEvent.getLifeLeft());
			if(bFlag && !oIncidentEvent.isOver() && oIncidentEvent.getLifeLeft() === 1){
				oIncidentEvent.setState('FAILED');
				oIncidentEvent.setStatus('FAILED');
			}
			if(oIncidentEvent.getLifeLeft() > 1){
				oIncidentEvent.setStatus('DEFERRED');
			}
		};
	};

	Incident.prototype.reset									= function(){
		Logger.logDebug('Incident.reset() | ');
		this.resetDayRuntimes();
		this.sState			= 'NOTSTARTED';
		this.sStatus		= 'NOTSTARTED';
		this.sGoToEventID	= '';
		this.nDay			= this.nStoredDay;

		var oIncidentEvent,
			i;

		for(i=0; i<this.aIncidentEvent.length; i++){
			oIncidentEvent		= this.aIncidentEvent[i];
			this.removeIncidentEventListeners(oIncidentEvent);
			this.addIncidentEventListeners(oIncidentEvent);
			oIncidentEvent.reset();
		}
	};

	Incident.prototype.toString 								= function(){
		return 'framework/simulation/model/Incident';
	};

	return Incident;
});